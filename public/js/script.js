document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        acesso: document.querySelector('input[name="acesso"]:checked')?.value
    };

    if (!formData.email || !formData.email.trim()) {
        uiAlert('Informe o seu email para continuar.', { title: 'Email Não Informado', type: 'warning' });
        return;
    }

    if (!formData.password || formData.password.length < 6) {
        uiAlert('Informe a sua senha (mínimo 6 caracteres) para continuar.', { title: 'Senha Não Informada', type: 'warning' });
        return;
    }

    if (!formData.acesso) {
        uiAlert('Selecione um perfil de acesso para continuar.', { title: 'Perfil Não Selecionado', type: 'warning' });
        return;
    }

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = data.redirect;
        } else {
            uiAlert(data.error || 'Erro ao fazer login', { title: 'Erro no Login', type: 'error' });
        }
    } catch (error) {
        console.error('Erro:', error);
        uiAlert('Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.', { title: 'Erro no Login', type: 'error' });
    }
});