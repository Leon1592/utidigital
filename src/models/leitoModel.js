const db = require('../config/db');

async function findAll() {
    const result = await db.query('SELECT * FROM leitos ORDER BY numero');
    return result.rows;
}

async function findById(id) {
    const result = await db.query(`
        SELECT l.*,
               u.name as medico_responsavel_nome,
               u.email as medico_responsavel_email
        FROM leitos l
        LEFT JOIN users u ON l.medico_responsavel_id = u.id
        WHERE l.id = $1
    `, [id]);
    return result.rows[0];
}

async function findByNumero(numero) {
    const result = await db.query('SELECT id FROM leitos WHERE numero = $1', [numero]);
    return result.rows[0];
}

async function findByPacienteId(pacienteId) {
    const result = await db.query(`
        SELECT l.*, u.name as medico_responsavel_nome, u.email as medico_responsavel_email
        FROM leitos l
        LEFT JOIN users u ON l.medico_responsavel_id = u.id
        WHERE l.paciente_id = $1
    `, [pacienteId]);
    return result.rows[0];
}

async function create(data) {
    const { numero, status, paciente_nome, data_internacao, observacoes } = data;
    const result = await db.query(
        'INSERT INTO leitos (numero, status, paciente_nome, data_internacao, observacoes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [numero, status || 'disponivel', paciente_nome || null, data_internacao || null, observacoes || null]
    );
    return result.rows[0];
}

async function update(id, data) {
    const { status, paciente_nome, data_internacao, observacoes, paciente_id, medico_responsavel_id, motivo_admissao, data_nascimento_paciente, cpf_paciente } = data;
    const result = await db.query(
        `UPDATE leitos SET
            status = $1, paciente_nome = $2, data_internacao = $3, observacoes = $4,
            paciente_id = $5, medico_responsavel_id = $6, motivo_admissao = $7,
            data_nascimento_paciente = $8, cpf_paciente = $9
        WHERE id = $10 RETURNING *`,
        [status, paciente_nome, data_internacao, observacoes, paciente_id, medico_responsavel_id, motivo_admissao, data_nascimento_paciente, cpf_paciente, id]
    );
    return result.rows[0];
}

async function remove(id) {
    await db.query('DELETE FROM leitos WHERE id = $1', [id]);
}

async function findAltaInfo(id) {
    const result = await db.query('SELECT paciente_id, paciente_nome FROM leitos WHERE id = $1', [id]);
    return result.rows[0];
}

async function countByStatus(status) {
    const result = await db.query("SELECT COUNT(*) as total FROM leitos WHERE status = $1", [status]);
    return parseInt(result.rows[0]?.total || 0);
}

async function resetPacienteData(id) {
    await db.query(`
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
}

module.exports = {
    findAll,
    findById,
    findByNumero,
    findByPacienteId,
    create,
    update,
    remove,
    findAltaInfo,
    countByStatus,
    resetPacienteData
};
