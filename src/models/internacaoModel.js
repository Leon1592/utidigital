const db = require('../config/db');

async function createFromLeito(leitoId) {
    await db.query(`
        INSERT INTO internacoes (leito_id, leito_numero, paciente_id, paciente_nome, medico_responsavel_nome, motivo_admissao, data_internacao)
        SELECT l.id, l.numero, l.paciente_id, l.paciente_nome, u.name, l.motivo_admissao, COALESCE(l.data_internacao, NOW())
        FROM leitos l
        LEFT JOIN users u ON u.id = l.medico_responsavel_id
        WHERE l.id = $1
    `, [leitoId]);
}

async function findAtivaByLeito(leitoId) {
    const result = await db.query(
        'SELECT * FROM internacoes WHERE leito_id = $1 AND data_alta IS NULL ORDER BY data_internacao DESC LIMIT 1',
        [leitoId]
    );
    return result.rows[0];
}

async function closeByLeito(leitoId) {
    await db.query(
        'UPDATE internacoes SET data_alta = NOW() WHERE leito_id = $1 AND data_alta IS NULL',
        [leitoId]
    );
}

async function moveBetweenLeitos(origemId, destinoId, destinoNumero) {
    await db.query(
        'UPDATE internacoes SET leito_id = $2, leito_numero = $3 WHERE leito_id = $1 AND data_alta IS NULL',
        [origemId, destinoId, destinoNumero]
    );
}

async function removeByPaciente(pacienteId) {
    await db.query('DELETE FROM internacoes WHERE paciente_id = $1', [pacienteId]);
}

async function findById(id) {
    const result = await db.query('SELECT * FROM internacoes WHERE id = $1', [id]);
    return result.rows[0];
}

async function removeById(id) {
    await db.query('DELETE FROM internacoes WHERE id = $1', [id]);
}

async function findAll() {
    const result = await db.query(`
        SELECT i.*, p.cpf, p.data_nascimento, p.sexo
        FROM internacoes i
        LEFT JOIN pacientes p ON p.id = i.paciente_id
        ORDER BY i.data_internacao DESC
    `);
    return result.rows;
}

module.exports = {
    createFromLeito,
    findAtivaByLeito,
    closeByLeito,
    moveBetweenLeitos,
    removeByPaciente,
    findById,
    removeById,
    findAll
};
