const pacienteService = require('../services/pacienteService');

async function createPaciente(req, res) {
    try {
        const paciente = await pacienteService.create(req.body);
        res.status(201).json(paciente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getPacientes(req, res) {
    try {
        const pacientes = await pacienteService.getAll();
        res.status(200).json(pacientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function searchPacientes(req, res) {
    try {
        const { nome } = req.query;
        const pacientes = nome 
            ? await pacienteService.searchByNome(nome)
            : await pacienteService.getAll();
        res.status(200).json(pacientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createPaciente,
    getPacientes,
    searchPacientes
};