const usuario = auth.exigirLogin();
inicializarSidebar();

const listaMetasEl = document.getElementById('listaMetas');
const modal = document.getElementById('modalAporte');
const aporteValorInput = document.getElementById('aporteValor');

aplicarMascaraMoeda(aporteValorInput);

async function carregarMetas() {
    try {
        const metas = await api.get(`/metas/usuario/${usuario.id}`);
        renderizarMetas(metas);
    } catch (error) {
        console.error(error);
        listaMetasEl.innerHTML = `
            <div class="col-span-full p-10 text-center text-sm text-red-500 bg-white rounded-3xl border border-red-100">
                Erro ao carregar metas: ${error.message}
            </div>`;
    }
}

function renderizarMetas(metas) {
    if (!metas.length) {
        listaMetasEl.innerHTML = `
            <div class="col-span-full p-10 text-center bg-white rounded-3xl border border-gray-100">
                <p class="text-gray-500 mb-4">Você ainda não tem metas. Que tal criar uma?</p>
                <a href="meta-compartilhada.html" class="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-5 rounded-xl transition-colors">
                    Criar primeira meta
                </a>
            </div>`;
        return;
    }

    listaMetasEl.innerHTML = metas.map(m => {
        const percentual = Math.min(100, (Number(m.valorAtual) / Number(m.valorObjetivo)) * 100);
        const compartilhada = m.nomesUsuarios && m.nomesUsuarios.length > 1;
        const badge = compartilhada
            ? `<span class="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Compartilhada (${m.nomesUsuarios.length})</span>`
            : `<span class="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Individual</span>`;

        return `
            <article class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 card-hover">
                <div class="flex items-start justify-between gap-3 mb-4">
                    <h3 class="text-xl font-bold text-gray-900">${m.nome}</h3>
                    ${badge}
                </div>

                <div class="mb-2 flex justify-between text-sm">
                    <span class="text-gray-500">Progresso</span>
                    <span class="font-bold text-amber-600">${percentual.toFixed(1)}%</span>
                </div>
                <div class="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-4">
                    <div class="bg-gradient-to-r from-amber-400 to-yellow-500 h-full transition-all" style="width: ${percentual}%"></div>
                </div>

                <div class="flex justify-between items-end mb-4">
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wider">Já guardado</p>
                        <p class="text-lg font-bold text-gray-800">${formatarMoeda(m.valorAtual)}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-400 uppercase tracking-wider">Objetivo</p>
                        <p class="text-lg font-bold text-gray-800">${formatarMoeda(m.valorObjetivo)}</p>
                    </div>
                </div>

                <div class="text-xs text-gray-500 mb-4">
                    <p>Até ${formatarData(m.dataLimite)}</p>
                    ${compartilhada ? `<p class="mt-1">Participantes: ${m.nomesUsuarios.join(', ')}</p>` : ''}
                </div>

                <button type="button" data-aporte-id="${m.id}" data-aporte-nome="${m.nome}"
                    class="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 px-4 rounded-xl transition-colors">
                    Adicionar Aporte
                </button>
            </article>
        `;
    }).join('');

    document.querySelectorAll('[data-aporte-id]').forEach(btn => {
        btn.addEventListener('click', () => abrirModalAporte(btn.dataset.aporteId, btn.dataset.aporteNome));
    });
}

function abrirModalAporte(id, nome) {
    document.getElementById('aporteMetaId').value = id;
    document.getElementById('aporteMetaNome').textContent = nome;
    aporteValorInput.value = '';
    modal.classList.remove('hidden');
    aporteValorInput.focus();
}

function fecharModalAporte() {
    modal.classList.add('hidden');
}

document.getElementById('fecharModalAporte').addEventListener('click', fecharModalAporte);
modal.addEventListener('click', (e) => { if (e.target === modal) fecharModalAporte(); });

document.getElementById('aporteForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const metaId = document.getElementById('aporteMetaId').value;
    const valor = desmascararMoeda(aporteValorInput.value);

    if (!valor || valor <= 0) {
        mostrarAlerta('Informe um valor maior que zero.', 'error');
        return;
    }

    const btn = document.getElementById('aporteBtn');
    btn.disabled = true;
    btn.textContent = 'Processando...';

    try {
        await api.put(`/metas/${metaId}/aporte`, { valor });
        fecharModalAporte();
        mostrarAlerta('Aporte registrado!', 'success');
        await carregarMetas();
    } catch (error) {
        console.error(error);
        mostrarAlerta('Erro ao registrar aporte: ' + error.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Confirmar Aporte';
    }
});

carregarMetas();
