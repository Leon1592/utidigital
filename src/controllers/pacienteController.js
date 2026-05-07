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

async function deletePaciente(req, res) {
    try {
        await pacienteService.remove(req.params.id);
        res.status(200).json({ message: 'Paciente excluido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getPacienteById(req, res) {
    try {
        const paciente = await pacienteService.getById(req.params.id);
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente nao encontrado' });
        }
        res.status(200).json(paciente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createPaciente,
    getPacientes,
    searchPacientes,
    deletePaciente,
    getPacienteById
};