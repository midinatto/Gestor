/**
 * Gerenciamento da sessão do usuário (login, logout, guarda de rotas).
 * Como o backend ainda não tem JWT, usamos o localStorage guardando o usuário.
 */

const STORAGE_KEY = 'nexus:usuario';

const auth = {
    salvarUsuario(usuario) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    },

    usuarioLogado() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        try { return JSON.parse(raw); } catch { return null; }
    },

    estaLogado() {
        return !!this.usuarioLogado();
    },

    logout() {
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = 'login.html';
    },

    /** Exige login — usado em páginas privadas. Redireciona se não estiver logado. */
    exigirLogin() {
        if (!this.estaLogado()) {
            window.location.href = 'login.html';
            return null;
        }
        return this.usuarioLogado();
    },

    /** Se já estiver logado redireciona para home (usado em login/cadastro). */
    redirecionarSeLogado() {
        if (this.estaLogado()) {
            window.location.href = 'home.html';
        }
    }
};

window.auth = auth;
