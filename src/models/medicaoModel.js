const db = require('../config/db');

async function create(medicao) {
    const query = `
        INSERT INTO medicoes (leito_id, frequencia_cardiaca, pressao_sistolica, pressao_diastolica, spo2, temperatura, observacoes, registrado_por)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    const values = [
        medicao.leito_id,
        medicao.frequencia_cardiaca,
        medicao.pressao_sistolica,
        medicao.pressao_diastolica,
        medicao.saturacao,
        medicao.temperatura,
        medicao.observacoes || null,
        medicao.registrado_por
    ];

    const result = await db.query(query, values);
    return result.rows[0];
}

async function findByLeito(leitoId) {
    const result = await db.query(
        `SELECT m.*, u.name as registrado_por_nome,
                (m.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo') as created_at
         FROM medicoes m
         LEFT JOIN users u ON m.registrado_por = u.id
         WHERE m.leito_id = $1
         ORDER BY m.created_at DESC`,
        [leitoId]
    );
    return result.rows;
}

async function getLatest(leitoId) {
    const result = await db.query(
        `SELECT leito_id, frequencia_cardiaca, pressao_sistolica, pressao_diastolica, spo2, temperatura,
                (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo') as created_at
         FROM medicoes WHERE leito_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [leitoId]
    );
    return result.rows[0];
}

async function deleteAllByLeito(leitoId) {
    const result = await db.query('DELETE FROM medicoes WHERE leito_id = $1', [leitoId]);
    return result.rows;
}

async function countCritical() {
    const result = await db.query(`
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
    return parseInt(result.rows[0]?.total || 0);
}

async function findByLeitoWithPeriod(leitoId, periodo) {
    const result = await db.query(`
        SELECT m.*, u.name as registrado_por_nome,
               (m.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo') as created_at
        FROM medicoes m
        LEFT JOIN users u ON m.registrado_por = u.id
        WHERE m.leito_id = $1
        AND m.created_at >= NOW() - INTERVAL '1 day' * $2
        ORDER BY m.created_at DESC
    `, [leitoId, periodo]);
    return result.rows;
}

module.exports = {
    create,
    findByLeito,
    getLatest,
    deleteAllByLeito,
    countCritical,
    findByLeitoWithPeriod
};