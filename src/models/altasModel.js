const db = require('../config/db');

async function create(pacienteId, pacienteNome) {
    await db.query(
        'INSERT INTO altas (paciente_id, paciente_nome, data_alta) VALUES ($1, $2, NOW())',
        [pacienteId, pacienteNome]
    );
}

async function countRecent24h() {
    const result = await db.query(
        "SELECT COUNT(*) as total FROM altas WHERE data_alta >= NOW() - INTERVAL '24 hours'"
    );
    return parseInt(result.rows[0]?.total || 0);
}

module.exports = { create, countRecent24h };
