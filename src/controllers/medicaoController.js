const medicaoModel = require('../models/medicaoModel');

async function createMedicao(req, res) {
    try {
        const { leito_id, frequencia_cardiaca, pressao_sistolica, pressao_diastolica, saturacao, temperatura, observacoes } = req.body;
        
        if (!leito_id || !frequencia_cardiaca || !pressao_sistolica || !pressao_diastolica || !saturacao || !temperatura) {
            return res.status(400).json({ error: 'Todos os campos de medicao sao obrigatorios' });
        }

        const medicao = await medicaoModel.create({
            leito_id,
            frequencia_cardiaca,
            pressao_sistolica,
            pressao_diastolica,
            saturacao,
            temperatura,
            observacoes,
            registrado_por: req.session.user ? req.session.user.id : null
        });

        res.status(201).json(medicao);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getMedicoesByLeito(req, res) {
    try {
        const { leitoId } = req.params;
        const medicoes = await medicaoModel.findByLeito(leitoId);
        res.status(200).json(medicoes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getLatestMedicao(req, res) {
    try {
        const { leitoId } = req.params;
        const medicao = await medicaoModel.getLatest(leitoId);
        res.status(200).json(medicao || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteAllByLeito(req, res) {
    try {
        console.log('deleteAllByLeito called with leitoId:', req.params.leitoId);
        const { leitoId } = req.params;
        await medicaoModel.deleteAllByLeito(leitoId);
        res.status(200).json({ message: 'Histórico excluído' });
    } catch (error) {
        console.error('deleteAllByLeito error:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createMedicao,
    getMedicoesByLeito,
    getLatestMedicao,
    deleteAllByLeito
};