const userModel = require('../models/userModel');

const ADMIN_GERAL_EMAIL = 'adminsistemageral@uti.com';

async function createUser(req, res) {
    try {
        const { name, email, password, perfil } = req.body;

        if (!name || name.trim().length < 3) {
            return res.status(400).json({ error: 'Nome deve ter no minimo 3 caracteres' });
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Email invalido' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Senha deve ter no minimo 6 caracteres' });
        }
        if (!perfil || !['Medico', 'Enfermeiro', 'Admin'].includes(perfil)) {
            return res.status(400).json({ error: 'Perfil invalido' });
        }

        const user = await userModel.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar usuario' });
    }
}

async function getUsers(req, res) {
    try {
        const { perfil } = req.query;
        let users;
        if (perfil) {
            users = await userModel.findByPerfil(perfil);
        } else {
            users = await userModel.findAll();
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuarios' });
    }
}

async function deleteUser(req, res) {
    try {
        const user = await userModel.findById(req.params.id);
        if (user && user.email === ADMIN_GERAL_EMAIL) {
            return res.status(403).json({ error: 'Este usuario nao pode ser excluido.' });
        }
        await userModel.remove(req.params.id);
        res.status(200).json({ message: 'Usuario excluido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir usuario' });
    }
}

module.exports = {
  getUsers: getUsers,
  createUser: createUser,
  deleteUser: deleteUser
}