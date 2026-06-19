const usuario = auth.exigirLogin();
inicializarSidebar();

const EMOJIS_CATEGORIA = {
    'alimentacao': '🛒', 'alimentação': '🛒',
    'transporte': '🚗',
    'moradia': '🏠',
    'saude': '💊', 'saúde': '💊',
    'lazer': '🎉',
    'educacao': '📚', 'educação': '📚',
    'salario': '💼', 'salário': '💼',
    'investimentos': '📈',
    'outros': '📦'
};

const inputValor = document.getElementById('valor');
const resumoValor = document.getElementById('resumoValor');
const dataInput = document.getElementById('data');
const selectCategoria = document.getElementById('categoria');

let categorias = [];

dataInput.valueAsDate = new Date();
atualizarResumoData();

aplicarMascaraMoeda(inputValor, (valor) => {
    resumoValor.textContent = `R$ ${valor}`;
});

document.getElementById('descricao').addEventListener('input', (e) => {
    document.getElementById('resumoDescricao').textContent = e.target.value || 'Sua descrição aqui';
});

selectCategoria.addEventListener('change', (e) => {
    const opcao = e.target.options[e.target.selectedIndex];
    document.getElementById('resumoCategoria').textContent = opcao.text.replace(/^[^\w\sÀ-ÿ]+\s*/, '');
});

dataInput.addEventListener('change', atualizarResumoData);

document.querySelectorAll('input[name="tipo"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const entrada = e.target.value === 'ENTRADA';
        document.getElementById('resumoTipo').textContent = entrada ? 'Entrada' : 'Saída';
        const icone = document.getElementById('resumoIcone');
        icone.classList.remove('bg-red-50', 'text-red-500', 'bg-green-50', 'text-green-500');
        icone.classList.add(entrada ? 'bg-green-50' : 'bg-red-50', entrada ? 'text-green-500' : 'text-red-500');
        filtrarCategoriasPorTipo();
    });
});

function atualizarResumoData() {
    if (!dataInput.value) return;
    document.getElementById('resumoData').textContent = formatarData(dataInput.value);
}

async function carregarCategorias() {
    try {
        categorias = await api.get('/categorias');
        filtrarCategoriasPorTipo();
    } catch (error) {
        console.error(error);
        mostrarAlerta('Erro ao carregar categorias: ' + error.message, 'error');
    }
}

function filtrarCategoriasPorTipo() {
    const tipoTransacao = document.querySelector('input[name="tipo"]:checked').value;
    const tipoCategoria = tipoTransacao === 'ENTRADA' ? 'RECEITA' : 'DESPESA';
    const filtradas = categorias.filter(c => c.tipo === tipoCategoria);

    selectCategoria.innerHTML = filtradas.length
        ? '<option value="" disabled selected>Selecione...</option>' +
          filtradas.map(c => {
              const emoji = EMOJIS_CATEGORIA[c.nome.toLowerCase()] || '📌';
              return `<option value="${c.id}">${emoji} ${c.nome}</option>`;
          }).join('')
        : '<option value="" disabled selected>Nenhuma categoria cadastrada</option>';

    document.getElementById('resumoCategoria').textContent = '-';
}

document.getElementById('gastoForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    const payload = {
        descricao: form.descricao.value.trim(),
        valor: desmascararMoeda(form.valor.value),
        data: form.data.value,
        tipo: form.tipo.value,
        usuarioId: usuario.id,
        categoriaId: parseInt(form.categoria.value, 10)
    };

    if (!payload.valor || payload.valor <= 0) {
        mostrarAlerta('Informe um valor maior que zero.', 'error');
        return;
    }

    ativarLoadingBotao(submitBtn, btnText, btnSpinner, 'Salvando...');

    try {
        await api.post('/transacoes', payload);
        mostrarAlerta('Transação registrada com sucesso!', 'success');
        form.reset();
        inputValor.value = '';
        resumoValor.textContent = 'R$ 0,00';
        document.getElementById('resumoDescricao').textContent = 'Sua descrição aqui';
        document.querySelector('input[name="tipo"][value="SAIDA"]').checked = true;
        document.getElementById('resumoTipo').textContent = 'Saída';
        dataInput.valueAsDate = new Date();
        atualizarResumoData();
        filtrarCategoriasPorTipo();
    } catch (error) {
        console.error(error);
        mostrarAlerta('Erro ao salvar a transação: ' + error.message, 'error');
    } finally {
        desativarLoadingBotao(submitBtn, btnText, btnSpinner, 'Salvar Transação');
    }
});

carregarCategorias();
