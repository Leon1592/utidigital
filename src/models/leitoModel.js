const db = require('../config/db');

const UPDATABLE_FIELDS = ['status', 'paciente_nome', 'data_internacao', 'observacoes', 'paciente_id', 'medico_responsavel_id', 'motivo_admissao', 'data_nascimento_paciente', 'cpf_paciente', 'motivo_indisponivel'];

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
    const sets = [];
    const values = [];
    for (const field of UPDATABLE_FIELDS) {
        if (data[field] !== undefined) {
            sets.push(`${field} = $${values.length + 1}`);
            values.push(data[field]);
        }
    }
    if (sets.length === 0) {
        return findById(id);
    }
    values.push(id);
    const result = await db.query(
        `UPDATE leitos SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`,
        values
    );
    return result.rows[0];
}

async function remove(id) {
    await db.query('DELETE FROM leitos WHERE id = $1', [id]);
}

async function findAltaInfo(id) {
    const result = await db.query('SELECT id, numero, paciente_id, paciente_nome, data_internacao FROM leitos WHERE id = $1', [id]);
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
            data_internacao = NULL,
            motivo_indisponivel = NULL
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
