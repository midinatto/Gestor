const usuario = auth.exigirLogin();
inicializarSidebar();

async function carregarDashboard() {
    try {
        const [saldo, transacoes] = await Promise.all([
            api.get(`/transacoes/usuario/${usuario.id}/saldo`),
            api.get(`/transacoes/usuario/${usuario.id}`)
        ]);

        document.getElementById('cardSaldo').textContent = formatarMoeda(saldo);

        const totalSaidas = transacoes
            .filter(t => t.tipo === 'SAIDA')
            .reduce((acc, t) => acc + Number(t.valor), 0);
        document.getElementById('cardSaidas').textContent = formatarMoeda(totalSaidas);

        renderizarTransacoes(transacoes);
    } catch (error) {
        console.error(error);
        document.getElementById('listaTransacoes').innerHTML = `
            <div class="p-6 text-center text-sm text-red-500">Erro ao carregar dashboard: ${error.message}</div>
        `;
    }
}

function renderizarTransacoes(transacoes) {
    const container = document.getElementById('listaTransacoes');

    if (!transacoes.length) {
        container.innerHTML = `
            <div class="p-10 text-center text-sm text-gray-400">
                Você ainda não tem transações. Comece registrando uma em "Meus Gastos".
            </div>`;
        return;
    }

    const ordenadas = [...transacoes].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 10);

    container.innerHTML = ordenadas.map(t => {
        const entrada = t.tipo === 'ENTRADA';
        const iconeBg = entrada ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500';
        const sinal = entrada ? '+' : '-';
        const corValor = entrada ? 'text-green-600' : 'text-red-500';
        return `
            <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 ${iconeBg} rounded-2xl flex items-center justify-center font-bold">
                        ${entrada ? '↑' : '↓'}
                    </div>
                    <div>
                        <p class="font-bold text-gray-800">${t.descricao}</p>
                        <p class="text-xs text-gray-400">${formatarData(t.data)} • ${t.nomeCategoria}</p>
                    </div>
                </div>
                <span class="font-bold ${corValor}">${sinal} ${formatarMoeda(t.valor)}</span>
            </div>
        `;
    }).join('');
}

carregarDashboard();
