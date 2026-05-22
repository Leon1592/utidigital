const bcrypt = require('bcrypt');
const db = require('../config/db');

async function login(req, res) {
    try {
        const { email, password, acesso } = req.body;

        const result = await db.query(
            'SELECT * FROM users WHERE email = $1 AND perfil = $2',
            [email, acesso]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado ou perfil incorreto' });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            perfil: user.perfil
        };

        res.json({ success: true, redirect: '/dashboard' });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function logout(req, res) {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao fazer logout' });
            }
            res.redirect('/');
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer logout' });
    }
}

function getUser(req, res) {
    if (req.session && req.session.user) {
        return res.json({ user: req.session.user });
    }
    return res.status(401).json({ error: 'Não autenticado' });
}

module.exports = { login, logout, getUser };
