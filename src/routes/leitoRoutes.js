const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM leitos ORDER BY numero');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar leitos:', error);
        res.status(500).json({ error: 'Erro ao buscar leitos' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { numero, status, paciente_nome, data_internacao, observacoes } = req.body;
        const result = await pool.query(
            'INSERT INTO leitos (numero, status, paciente_nome, data_internacao, observacoes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [numero, status || 'disponivel', paciente_nome || null, data_internacao || null, observacoes || null]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar leito:', error);
        res.status(500).json({ error: 'Erro ao criar leito' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paciente_nome, data_internacao, observacoes } = req.body;
        const result = await pool.query(
            'UPDATE leitos SET status = $1, paciente_nome = $2, data_internacao = $3, observacoes = $4 WHERE id = $5 RETURNING *',
            [status, paciente_nome, data_internacao, observacoes, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar leito:', error);
        res.status(500).json({ error: 'Erro ao atualizar leito' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM leitos WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir leito:', error);
        res.status(500).json({ error: 'Erro ao excluir leito' });
    }
});

module.exports = router;