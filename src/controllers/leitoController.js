const leitoModel = require('../models/leitoModel');
const medicaoModel = require('../models/medicaoModel');
const altasModel = require('../models/altasModel');
const pacienteModel = require('../models/pacienteModel');

async function listLeitos(req, res) {
    try {
        const leitos = await leitoModel.findAll();
        res.json(leitos);
    } catch (error) {
        console.error('Erro ao buscar leitos:', error);
        res.status(500).json({ error: 'Erro ao buscar leitos' });
    }
}

async function getLeito(req, res) {
    try {
        const { id } = req.params;
        const leito = await leitoModel.findById(id);
        if (!leito) {
            return res.status(404).json({ error: 'Leito nao encontrado' });
        }
        res.json(leito);
    } catch (error) {
        console.error('Erro ao buscar leito:', error);
        res.status(500).json({ error: 'Erro ao buscar leito' });
    }
}

async function createLeito(req, res) {
    try {
        const { numero } = req.body;

        if (!numero || !Number.isInteger(Number(numero)) || numero < 1) {
            return res.status(400).json({ error: 'Numero do leito deve ser um inteiro positivo' });
        }

        const existing = await leitoModel.findByNumero(numero);
        if (existing) {
            return res.status(400).json({ error: 'Leito ' + numero + ' ja existe' });
        }

        const leito = await leitoModel.create(req.body);
        res.json(leito);
    } catch (error) {
        console.error('Erro ao criar leito:', error);
        res.status(500).json({ error: 'Erro ao criar leito' });
    }
}

async function updateLeito(req, res) {
    try {
        const { id } = req.params;
        const leito = await leitoModel.update(id, req.body);
        res.json(leito);
    } catch (error) {
        console.error('Erro ao atualizar leito:', error);
        res.status(500).json({ error: 'Erro ao atualizar leito' });
    }
}

async function deleteLeito(req, res) {
    try {
        const { id } = req.params;
        await medicaoModel.deleteAllByLeito(id);
        await leitoModel.remove(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir leito:', error);
        res.status(500).json({ error: 'Erro ao excluir leito' });
    }
}

async function darAlta(req, res) {
    try {
        const { id } = req.params;
        const leito = await leitoModel.findAltaInfo(id);
        if (!leito) {
            return res.status(404).json({ error: 'Leito nao encontrado' });
        }

        const { paciente_id, paciente_nome } = leito;

        await medicaoModel.deleteAllByLeito(id);

        if (paciente_id) {
            await altasModel.create(paciente_id, paciente_nome);
            await pacienteModel.remove(paciente_id);
        }

        await leitoModel.resetPacienteData(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao dar alta:', error);
        res.status(500).json({ error: 'Erro ao dar alta' });
    }
}

module.exports = {
    listLeitos,
    getLeito,
    createLeito,
    updateLeito,
    deleteLeito,
    darAlta
};
