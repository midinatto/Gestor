/**
 * Inicializa o sidebar compartilhado pelas páginas internas.
 * - Marca o link ativo baseado na página atual
 * - Liga o botão "Sair" ao auth.logout()
 * - Preenche nome/avatar do usuário no cabeçalho, se existir
 */

function inicializarSidebar() {
    const paginaAtual = window.location.pathname.split('/').pop() || 'home.html';

    document.querySelectorAll('[data-nav-link]').forEach(link => {
        const alvo = link.getAttribute('data-nav-link');
        const ativo = alvo === paginaAtual;

        link.classList.remove('text-yellow-50', 'hover:bg-white/10', 'bg-white/20', 'text-white');
        if (ativo) {
            link.classList.add('bg-white/20', 'text-white');
        } else {
            link.classList.add('text-yellow-50', 'hover:bg-white/10');
        }
    });

    document.querySelectorAll('[data-logout]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Deseja realmente sair da sua conta Nexus?')) {
                auth.logout();
            }
        });
    });

    const usuario = auth.usuarioLogado();
    if (usuario) {
        document.querySelectorAll('[data-user-name]').forEach(el => {
            el.textContent = usuario.nome.split(' ')[0];
        });
        document.querySelectorAll('[data-user-avatar]').forEach(el => {
            el.textContent = iniciaisDoNome(usuario.nome);
        });
    }
}

function iniciaisDoNome(nome) {
    if (!nome) return '--';
    const partes = nome.trim().split(/\s+/);
    let iniciais = partes[0].charAt(0).toUpperCase();
    if (partes.length > 1) iniciais += partes[partes.length - 1].charAt(0).toUpperCase();
    return iniciais;
}

window.inicializarSidebar = inicializarSidebar;
window.iniciaisDoNome = iniciaisDoNome;
