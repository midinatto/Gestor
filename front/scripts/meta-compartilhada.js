const usuario = auth.exigirLogin();
inicializarSidebar();

const inputValor = document.getElementById('valorObjetivo');
const inputData = document.getElementById('dataLimite');
const inputNome = document.getElementById('nome');
const listaParticipantesEl = document.getElementById('listaParticipantes');
const resumoParticipantesEl = document.getElementById('resumoParticipantes');

const hoje = new Date();
const daqui3meses = new Date(hoje.getFullYear(), hoje.getMonth() + 3, hoje.getDate());
inputData.valueAsDate = daqui3meses;
inputData.min = hoje.toISOString().split('T')[0];
atualizarResumoData();

aplicarMascaraMoeda(inputValor, (valor) => {
    document.getElementById('resumoValor').textContent = `R$ ${valor}`;
});

inputNome.addEventListener('input', (e) => {
    document.getElementById('resumoNome').textContent = e.target.value || 'Nova Meta';
});

inputData.addEventListener('change', atualizarResumoData);

function atualizarResumoData() {
    document.getElementById('resumoData').textContent = formatarData(inputData.value);
}

async function carregarUsuarios() {
    try {
        const usuarios = await api.get('/usuarios');
        renderizarUsuarios(usuarios);
    } catch (error) {
        console.error(error);
        listaParticipantesEl.innerHTML = `<div class="col-span-full text-sm text-red-500 text-center py-6">Erro: ${error.message}</div>`;
    }
}

function renderizarUsuarios(usuarios) {
    if (!usuarios.length) {
        listaParticipantesEl.innerHTML = `<div class="col-span-full text-sm text-gray-400 text-center py-6">Nenhum usuário cadastrado.</div>`;
        return;
    }

    listaParticipantesEl.innerHTML = usuarios.map(u => {
        const eu = u.id === usuario.id;
        return `
            <label class="flex items-center gap-3 p-3 bg-gray-50 hover:bg-amber-50 rounded-xl cursor-pointer border border-gray-100 transition-colors ${eu ? 'opacity-90' : ''}">
                <input type="checkbox" value="${u.id}" ${eu ? 'checked disabled' : ''}
                    class="w-5 h-5 text-amber-500 rounded focus:ring-amber-500 border-gray-300 participante-check">
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-800 truncate">${u.nome}${eu ? ' (você)' : ''}</p>
                    <p class="text-xs text-gray-500 truncate">${u.email}</p>
                </div>
            </label>`;
    }).join('');

    listaParticipantesEl.querySelectorAll('.participante-check').forEach(chk => {
        chk.addEventListener('change', atualizarContadorParticipantes);
    });
    atualizarContadorParticipantes();
}

function atualizarContadorParticipantes() {
    const total = listaParticipantesEl.querySelectorAll('.participante-check:checked').length;
    resumoParticipantesEl.textContent = total || 1;
}

document.getElementById('metaForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    const idsSelecionados = Array.from(listaParticipantesEl.querySelectorAll('.participante-check'))
        .filter(chk => chk.checked || chk.disabled)
        .map(chk => parseInt(chk.value, 10));

    const payload = {
        nome: inputNome.value.trim(),
        valorObjetivo: desmascararMoeda(inputValor.value),
        dataLimite: inputData.value,
        usuariosIds: idsSelecionados
    };

    if (!payload.valorObjetivo || payload.valorObjetivo <= 0) {
        mostrarAlerta('Informe um valor objetivo maior que zero.', 'error');
        return;
    }

    ativarLoadingBotao(submitBtn, btnText, btnSpinner, 'Criando...');

    try {
        await api.post('/metas', payload);
        mostrarAlerta('Meta criada com sucesso! Redirecionando...', 'success');
        setTimeout(() => { window.location.href = 'metas.html'; }, 1000);
    } catch (error) {
        console.error(error);
        mostrarAlerta('Erro ao criar meta: ' + error.message, 'error');
    } finally {
        desativarLoadingBotao(submitBtn, btnText, btnSpinner, 'Criar Meta');
    }
});

carregarUsuarios();
