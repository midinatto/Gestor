/**
 * Utilitários de UI compartilhados entre telas: alertas, formatação de moeda, datas.
 */

function mostrarAlerta(mensagem, tipo = 'success', idAlvo = 'alertMessage') {
    const alertBox = document.getElementById(idAlvo);
    if (!alertBox) return;

    alertBox.textContent = mensagem;
    alertBox.classList.remove(
        'hidden',
        'bg-red-50', 'text-red-600', 'border-red-200',
        'bg-green-50', 'text-green-600', 'border-green-200'
    );

    if (tipo === 'error') {
        alertBox.classList.add('bg-red-50', 'text-red-600', 'border', 'border-red-200');
    } else {
        alertBox.classList.add('bg-green-50', 'text-green-600', 'border', 'border-green-200');
    }

    setTimeout(() => alertBox.classList.add('hidden'), 4000);
}

function formatarMoeda(valor) {
    const numero = typeof valor === 'number' ? valor : parseFloat(valor) || 0;
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function aplicarMascaraMoeda(input, callback) {
    input.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value === '') value = '0';
        value = (parseInt(value) / 100).toFixed(2);
        value = value.replace('.', ',');
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        e.target.value = value;
        if (callback) callback(value);
    });
}

function desmascararMoeda(valor) {
    if (!valor) return 0;
    return parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
}

function formatarData(dataIso) {
    if (!dataIso) return '-';
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
}

function ativarLoadingBotao(submitBtn, btnText, btnSpinner, textoLoading = 'Processando...') {
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    if (btnText) btnText.textContent = textoLoading;
    if (btnSpinner) btnSpinner.classList.remove('hidden');
}

function desativarLoadingBotao(submitBtn, btnText, btnSpinner, textoOriginal) {
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    if (btnText) btnText.textContent = textoOriginal;
    if (btnSpinner) btnSpinner.classList.add('hidden');
}

window.mostrarAlerta = mostrarAlerta;
window.formatarMoeda = formatarMoeda;
window.aplicarMascaraMoeda = aplicarMascaraMoeda;
window.desmascararMoeda = desmascararMoeda;
window.formatarData = formatarData;
window.ativarLoadingBotao = ativarLoadingBotao;
window.desativarLoadingBotao = desativarLoadingBotao;
