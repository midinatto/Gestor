auth.redirecionarSeLogado();

const togglePassword = document.getElementById('togglePassword');
const senhaInput = document.getElementById('senha');
const eyeIcon = document.getElementById('eyeIcon');

const OLHO_ABERTO = `
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
`;
const OLHO_FECHADO = `
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.188-1.581c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29"></path>
`;

togglePassword.addEventListener('click', () => {
    const tipo = senhaInput.type === 'password' ? 'text' : 'password';
    senhaInput.type = tipo;
    eyeIcon.innerHTML = tipo === 'text' ? OLHO_FECHADO : OLHO_ABERTO;
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    const credenciais = {
        email: form.email.value.trim(),
        senha: form.senha.value
    };

    ativarLoadingBotao(submitBtn, btnText, btnSpinner, 'Entrando...');

    try {
        const usuario = await api.post('/auth/login', credenciais);
        auth.salvarUsuario(usuario);
        mostrarAlerta(`Olá, ${usuario.nome}! Redirecionando...`, 'success');
        setTimeout(() => { window.location.href = 'home.html'; }, 800);
    } catch (error) {
        console.error(error);
        mostrarAlerta(error.message || 'E-mail ou senha inválidos.', 'error');
    } finally {
        desativarLoadingBotao(submitBtn, btnText, btnSpinner, 'Entrar');
    }
});
