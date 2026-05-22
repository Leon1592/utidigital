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
        res.status(500).json({ error: 'Erro ao buscar pacientes' });
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
        res.status(500).json({ error: 'Erro ao buscar paciente' });
    }
}

async function createPaciente(req, res) {
    try {
        const { nome, data_nascimento, cpf, sexo, contato_paciente } = req.body;

        if (!nome || nome.trim().length < 3) {
            return res.status(400).json({ error: 'Nome deve ter no minimo 3 caracteres' });
        }
        if (!data_nascimento) {
            return res.status(400).json({ error: 'Data de nascimento e obrigatoria' });
        }
        const dataNasc = new Date(data_nascimento);
        if (isNaN(dataNasc.getTime()) || dataNasc > new Date()) {
            return res.status(400).json({ error: 'Data de nascimento invalida' });
        }
        if (!cpf || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
            return res.status(400).json({ error: 'CPF invalido. Use o formato 000.000.000-00' });
        }
        if (!sexo) {
            return res.status(400).json({ error: 'Sexo e obrigatorio' });
        }
        if (!contato_paciente || contato_paciente.length < 10) {
            return res.status(400).json({ error: 'Contato deve ter no minimo 10 digitos' });
        }

        const paciente = await pacienteModel.create(req.body);
        res.status(201).json(paciente);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar paciente' });
    }
}

async function deletePaciente(req, res) {
    try {
        await pacienteModel.remove(req.params.id);
        res.status(200).json({ message: 'Paciente excluido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir paciente' });
    }
}

module.exports = {
    searchPacientes,
    getPacienteById,
    createPaciente,
    deletePaciente
};