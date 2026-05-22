function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function loadUser() {
    return fetch('/auth/user')
        .then(response => {
            if (!response.ok) {
                window.location.href = '/';
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (!data) return null;
            const user = data.user;
            const doctorName = document.getElementById('doctorName');
            const roleBadge = document.getElementById('roleBadge');
            if (doctorName) doctorName.textContent = user.name;
            if (roleBadge) {
                const perfilLabels = { Medico: 'Médico(a)', Enfermeiro: 'Enfermeiro(a)', Admin: 'Administrador' };
                roleBadge.textContent = perfilLabels[user.perfil] || user.perfil;
            }
            const cadastroUsers = document.getElementById('navCadastroUsuarios');
            if (cadastroUsers) {
                cadastroUsers.style.display = user.perfil === 'Admin' ? 'flex' : 'none';
                cadastroUsers.href = '/cadastro-usuarios';
            }
            return user;
        })
        .catch(() => {
            window.location.href = '/';
            return null;
        });
}
