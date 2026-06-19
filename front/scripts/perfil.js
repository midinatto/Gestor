const usuario = auth.exigirLogin();
inicializarSidebar();

document.getElementById('displayNome').textContent = usuario.nome;
document.getElementById('displayEmail').textContent = usuario.email;
document.getElementById('displayId').textContent = usuario.id;
document.getElementById('inputNome').value = usuario.nome;
document.getElementById('inputEmail').value = usuario.email;
document.getElementById('avatar').textContent = iniciaisDoNome(usuario.nome);
