const userModel = require('../models/userModel');

async function create(data) {
    if (!data.name || !data.email) {
        throw new Error('Nome e Email são obrigatórios')
    }

    return userModel.create(data);
}

async function getAll() {
    return userModel.findAll();
}

module.exports = {
    create,
    getAll
}