const db = require('../config/db');

async function create(data) {
    await db.query(
        'INSERT INTO altas (paciente_id, paciente_nome, leito_id, leito_numero, data_internacao, data_alta) VALUES ($1, $2, $3, $4, $5, NOW())',
        [data.pacienteId, data.pacienteNome, data.leitoId, data.leitoNumero, data.dataInternacao]
    );
}

async function findById(id) {
    const result = await db.query(
        'SELECT * FROM altas WHERE id = $1',
        [id]
    );
    return result.rows[0];
}

async function findLatestByPaciente(pacienteId) {
    const result = await db.query(
        'SELECT * FROM altas WHERE paciente_id = $1 ORDER BY data_alta DESC LIMIT 1',
        [pacienteId]
    );
    return result.rows[0];
}

async function removeByPaciente(pacienteId) {
    await db.query('DELETE FROM altas WHERE paciente_id = $1', [pacienteId]);
}

async function removeById(id) {
    await db.query('DELETE FROM altas WHERE id = $1', [id]);
}

async function findAllWithPaciente() {
    const result = await db.query(`
        SELECT a.id, a.paciente_id,
               COALESCE(p.nome, a.paciente_nome) AS paciente_nome,
               a.data_alta,
               p.cpf, p.data_nascimento, p.sexo, p.contato_paciente, p.motivo_admissao
        FROM altas a
        LEFT JOIN pacientes p ON p.id = a.paciente_id
        ORDER BY a.data_alta DESC
    `);
    return result.rows;
}

async function countRecent24h() {
    const result = await db.query(
        "SELECT COUNT(*) as total FROM altas WHERE data_alta >= NOW() - INTERVAL '24 hours'"
    );
    return parseInt(result.rows[0]?.total || 0);
}

module.exports = { create, findById, findLatestByPaciente, removeByPaciente, removeById, findAllWithPaciente, countRecent24h };
