const pacienteModel = require('../models/pacienteModel');

async function create(data) {
    if (!data.nome || !data.data_nascimento || !data.cpf) {
        throw new Error('Nome, data de nascimento e CPF sao obrigatorios');
    }
    return pacienteModel.create(data);
}

async function getAll() {
    return pacienteModel.findAll();
}

async function searchByNome(nome) {
    return pacienteModel.findByNome(nome);
}

async function remove(id) {
    return pacienteModel.remove(id);
}

async function getById(id) {
    return pacienteModel.findById(id);
}

module.exports = {
    create,
    getAll,
    searchByNome,
    remove,
    getById
};