const medicaoModel = require('../models/medicaoModel');

async function createMedicao(req, res) {
    try {
        const { leito_id, frequencia_cardiaca, pressao_sistolica, pressao_diastolica, saturacao, temperatura, observacoes } = req.body;
        
        if (!leito_id) {
            return res.status(400).json({ error: 'Leito nao informado' });
        }
        if (!frequencia_cardiaca || isNaN(frequencia_cardiaca) || frequencia_cardiaca < 0 || frequencia_cardiaca > 300) {
            return res.status(400).json({ error: 'Frequencia cardiaca invalida (0-300 bpm)' });
        }
        if (!pressao_sistolica || isNaN(pressao_sistolica) || pressao_sistolica < 0 || pressao_sistolica > 300) {
            return res.status(400).json({ error: 'Pressao sistolica invalida (0-300 mmHg)' });
        }
        if (!pressao_diastolica || isNaN(pressao_diastolica) || pressao_diastolica < 0 || pressao_diastolica > 300) {
            return res.status(400).json({ error: 'Pressao diastolica invalida (0-300 mmHg)' });
        }
        if (!saturacao || isNaN(saturacao) || saturacao < 0 || saturacao > 100) {
            return res.status(400).json({ error: 'SpO2 invalido (0-100%)' });
        }
        if (!temperatura || isNaN(temperatura) || temperatura < 30 || temperatura > 45) {
            return res.status(400).json({ error: 'Temperatura invalida (30-45 °C)' });
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
        res.status(500).json({ error: 'Erro ao registrar medicao' });
    }
}

async function getMedicoesByLeito(req, res) {
    try {
        const { leitoId } = req.params;
        const medicoes = await medicaoModel.findByLeito(leitoId);
        res.status(200).json(medicoes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar medicoes' });
    }
}

async function getLatestMedicao(req, res) {
    try {
        const { leitoId } = req.params;
        const medicao = await medicaoModel.getLatest(leitoId);
        res.status(200).json(medicao || null);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar medicao' });
    }
}

async function deleteAllByLeito(req, res) {
    try {
        const { leitoId } = req.params;
        await medicaoModel.deleteAllByLeito(leitoId);
        res.status(200).json({ message: 'Histórico excluído' });
    } catch (error) {
        console.error('deleteAllByLeito error:', error);
        res.status(500).json({ error: 'Erro ao excluir historico' });
    }
}

module.exports = {
    createMedicao,
    getMedicoesByLeito,
    getLatestMedicao,
    deleteAllByLeito
};