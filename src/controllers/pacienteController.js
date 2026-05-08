const pacienteModel = require('../models/pacienteModel');

async function searchPacientes(req, res) {
    try {
        const { nome } = req.query;
        let pacientes;
        if (nome) {
            pacientes = await pacienteModel.findByNome(nome);
        } else {
            pacientes = await pacienteModel.findAll();
        }
        res.status(200).json(pacientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getPacienteById(req, res) {
    try {
        const paciente = await pacienteModel.findById(req.params.id);
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente nao encontrado' });
        }
        res.status(200).json(paciente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createPaciente(req, res) {
    try {
        const paciente = await pacienteModel.create(req.body);
        res.status(201).json(paciente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deletePaciente(req, res) {
    try {
        await pacienteModel.remove(req.params.id);
        res.status(200).json({ message: 'Paciente excluido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    searchPacientes,
    getPacienteById,
    createPaciente,
    deletePaciente
};