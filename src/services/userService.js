const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

async function create(data) {
    if (!data.name || !data.email || !data.password || !data.perfil) {
        throw new Error('Nome, Email, Senha e Perfil são obrigatórios');
    }

    if (!['Medico', 'Enfermeiro', 'Admin'].includes(data.perfil)) {
        throw new Error('Perfil inválido. Use: Medico, Enfermeiro ou Admin');
    }

    const existingUser = await userModel.findByEmail(data.email);
    if (existingUser) {
        throw new Error('Já existe um usuário com este email');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return userModel.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        perfil: data.perfil
    });
}

async function getAll() {
    return userModel.findAll();
}

async function getByPerfil(perfil) {
    return userModel.findByPerfil(perfil);
}

async function getById(id) {
    return userModel.findById(id);
}

async function remove(id) {
    return userModel.remove(id);
}

module.exports = {
    create,
    getAll,
    getByPerfil,
    getById,
    remove
}