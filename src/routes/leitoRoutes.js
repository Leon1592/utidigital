const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/:id/alta', async (req, res) => {
    try {
        const { id } = req.params;
        const leito = await pool.query('SELECT paciente_id FROM leitos WHERE id = $1', [id]);
        if (leito.rows.length === 0) {
            return res.status(404).json({ error: 'Leito nao encontrado' });
        }
        const pacienteId = leito.rows[0].paciente_id;
        await pool.query('DELETE FROM medicoes WHERE leito_id = $1', [id]);
        if (pacienteId) {
            await pool.query('DELETE FROM pacientes WHERE id = $1', [pacienteId]);
        }
        await pool.query(`
            UPDATE leitos SET
                status = 'disponivel',
                paciente_nome = NULL,
                paciente_id = NULL,
                medico_responsavel_id = NULL,
                motivo_admissao = NULL,
                data_nascimento_paciente = NULL,
                cpf_paciente = NULL,
                data_internacao = NULL
            WHERE id = $1
        `, [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao dar alta:', error);
        res.status(500).json({ error: 'Erro ao dar alta' });
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM leitos ORDER BY numero');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar leitos:', error);
        res.status(500).json({ error: 'Erro ao buscar leitos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT l.*,
                   u.name as medico_responsavel_nome,
                   u.email as medico_responsavel_email
            FROM leitos l
            LEFT JOIN users u ON l.medico_responsavel_id = u.id
            WHERE l.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Leito nao encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar leito:', error);
        res.status(500).json({ error: 'Erro ao buscar leito' });
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
        const { status, paciente_nome, data_internacao, observacoes, paciente_id, medico_responsavel_id, motivo_admissao, data_nascimento_paciente, cpf_paciente } = req.body;
        const result = await pool.query(
            `UPDATE leitos SET
                status = $1, paciente_nome = $2, data_internacao = $3, observacoes = $4,
                paciente_id = $5, medico_responsavel_id = $6, motivo_admissao = $7,
                data_nascimento_paciente = $8, cpf_paciente = $9
            WHERE id = $10 RETURNING *`,
            [status, paciente_nome, data_internacao, observacoes, paciente_id, medico_responsavel_id, motivo_admissao, data_nascimento_paciente, cpf_paciente, id]
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
        await pool.query('DELETE FROM medicoes WHERE leito_id = $1', [id]);
        await pool.query('DELETE FROM leitos WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir leito:', error);
        res.status(500).json({ error: 'Erro ao excluir leito' });
    }
});

module.exports = router;
