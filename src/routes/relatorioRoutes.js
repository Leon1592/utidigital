const express = require('express');
const router = express.Router();
const pool = require('../config/db');

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

router.get('/alertas', async (req, res) => {
    try {
        const checkBeds = await pool.query(`
            SELECT l.id, l.numero, l.paciente_nome, l.status
            FROM leitos l
            WHERE l.status = 'ocupado'
            LIMIT 5
        `);
        
        if (checkBeds.rows.length === 0) {
            return res.json([]);
        }
        
        const alerts = [];
        
        for (const bed of checkBeds.rows) {
            const lastMed = await pool.query(`
                SELECT * FROM medicoes 
                WHERE leito_id = $1 
                ORDER BY created_at DESC LIMIT 1
            `, [bed.id]);
            
            if (lastMed.rows.length === 0) continue;
            
            const m = lastMed.rows[0];
            const issues = [];
            
            let paValue = null;
            const hasHighSistolica = isNumeric(m.pressao_sistolica) && parseFloat(m.pressao_sistolica) > 140;
            const hasHighDiastolica = isNumeric(m.pressao_diastolica) && parseFloat(m.pressao_diastolica) > 90;
            
            if (hasHighSistolica || hasHighDiastolica) {
                paValue = `${m.pressao_sistolica || 0}/${m.pressao_diastolica || 0}`;
                issues.push({ param: 'PA', value: paValue, normal: '< 140/90 mmHg', status: 'high' });
            }
            if (isNumeric(m.temperatura) && parseFloat(m.temperatura) > 37.5) {
                issues.push({ param: 'Temperatura', value: m.temperatura + '°C', normal: '< 37.5°C', status: 'high' });
            }
            if (isNumeric(m.spo2) && parseFloat(m.spo2) < 90) {
                issues.push({ param: 'SpO2', value: m.spo2 + '%', normal: '90-99%', status: 'low' });
            }
            if (isNumeric(m.spo2) && parseFloat(m.spo2) > 99) {
                issues.push({ param: 'SpO2', value: m.spo2 + '%', normal: '90-99%', status: 'high' });
            }
            if (isNumeric(m.frequencia_cardiaca) && parseFloat(m.frequencia_cardiaca) > 100) {
                issues.push({ param: 'FC', value: m.frequencia_cardiaca + ' bpm', normal: '50-100 bpm', status: 'high' });
            }
            if (isNumeric(m.frequencia_cardiaca) && parseFloat(m.frequencia_cardiaca) < 50) {
                issues.push({ param: 'FC', value: m.frequencia_cardiaca + ' bpm', normal: '50-100 bpm', status: 'low' });
            }
            
            if (issues.length > 0) {
                alerts.push({
                    leitoNumero: bed.numero,
                    pacienteNome: bed.paciente_nome,
                    issues: issues
                });
            }
        }
        
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/estatisticas', async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS altas (
                id SERIAL PRIMARY KEY,
                paciente_id INTEGER,
                paciente_nome VARCHAR(255),
                data_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        const leitosOcupados = await pool.query(
            "SELECT COUNT(*) as total FROM leitos WHERE status = 'ocupado'"
        );
        
        const altasCount = await pool.query(
            "SELECT COUNT(*) as total FROM altas WHERE data_alta >= NOW() - INTERVAL '24 hours'"
        );
        
        const criticalPatients = await pool.query(`
            WITH latest_medicoes AS (
                SELECT m.*, ROW_NUMBER() OVER (PARTITION BY m.leito_id ORDER BY m.created_at DESC) as rn
                FROM medicoes m
            )
            SELECT COUNT(*) as total FROM latest_medicoes lm
            WHERE lm.rn = 1 AND (
                lm.temperatura > 37.5 OR
                lm.pressao_sistolica > 140 OR
                lm.pressao_diastolica > 90 OR
                lm.spo2 < 90 OR
                lm.frequencia_cardiaca > 100 OR
                lm.frequencia_cardiaca < 50
            )
        `);

        res.json({
            leitosOcupados: parseInt(leitosOcupados.rows[0]?.total || 0),
            altas: parseInt(altasCount.rows[0]?.total || 0),
            estadosCriticos: parseInt(criticalPatients.rows[0]?.total || 0)
        });
    } catch (error) {
        console.error('Erro ao buscar estatisticas:', error);
        res.status(500).json({ error: 'Erro ao buscar estatisticas' });
    }
});

router.get('/pacientes-internados', async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS altas (
                id SERIAL PRIMARY KEY,
                paciente_id INTEGER,
                paciente_nome VARCHAR(255),
                data_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
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
