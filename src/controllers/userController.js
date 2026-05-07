const userService = require('../services/userService');

const ADMIN_GERAL_EMAIL = 'devjoaopedrofepereira2009@gmail.com';

async function createUser(req, res) {
    try {
        const user = await userService.create(req.body);
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
            users = await userService.getByPerfil(perfil);
        } else {
            users = await userService.getAll();
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const user = await userService.getById(req.params.id);
        if (user && user.email === ADMIN_GERAL_EMAIL) {
            return res.status(403).json({ error: 'Este usuario nao pode ser excluido.' });
        }
        await userService.remove(req.params.id);
        res.status(200).json({ message: 'Usuario excluido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function getAllUsers(req, res) {
  res.json({ message: "ok" })
}

module.exports = {
  getUsers: getUsers,
  createUser: createUser,
  deleteUser: deleteUser,
  getAllUsers: getAllUsers
}