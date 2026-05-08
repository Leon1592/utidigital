const userModel = require('../models/userModel');

const ADMIN_GERAL_EMAIL = 'adminsistemageral@uti.com';

async function createUser(req, res) {
    try {
        const user = await userModel.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
  getUsers: getUsers,
  createUser: createUser,
  deleteUser: deleteUser
}