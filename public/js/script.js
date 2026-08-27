document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        acesso: document.querySelector('input[name="acesso"]:checked')?.value
    };

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
            showPopup(data.error || 'Erro ao fazer login', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showPopup('Erro ao conectar com o servidor', 'error');
    }
});