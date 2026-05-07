const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/pacientes-internados', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.* FROM pacientes p
            INNER JOIN leitos l ON l.paciente_id = p.id
            WHERE l.status = 'ocupado'
            ORDER BY p.nome
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        res.status(500).json({ error: 'Erro ao buscar pacientes' });
    }
});

router.get('/paciente/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const periodo = parseInt(req.query.periodo) || 7;

        const leito = await pool.query(`
            SELECT l.*, u.name as medico_responsavel_nome, u.email as medico_responsavel_email
            FROM leitos l
            LEFT JOIN users u ON l.medico_responsavel_id = u.id
            WHERE l.paciente_id = $1
        `, [id]);

        const paciente = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);

        const leitoId = leito.rows[0]?.id;
        const dataInternacao = leito.rows[0]?.data_internacao;

        const medicoes = leitoId
            ? await pool.query(`
                SELECT m.*, u.name as registrado_por_nome,
                       (m.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo') as created_at
                FROM medicoes m
                LEFT JOIN users u ON m.registrado_por = u.id
                WHERE m.leito_id = $1
                AND m.created_at >= NOW() - INTERVAL '1 day' * $2
                ORDER BY m.created_at DESC
            `, [leitoId, periodo])
            : { rows: [] };

        res.json({
            paciente: { ...(paciente.rows[0] || {}), data_internacao: dataInternacao },
            leito: leito.rows[0] || null,
            medicoes: medicoes.rows
        });
    } catch (error) {
        console.error('Erro ao gerar relatorio:', error);
        res.status(500).json({ error: 'Erro ao gerar relatorio' });
    }
});

module.exports = router;
