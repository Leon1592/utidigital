const db = require('../config/db');

async function create(paciente) {
    const query = `
        INSERT INTO pacientes (nome, estado, sexo, data_nascimento, cpf, contato_paciente, motivo_admissao, logradouro, cidade, cep) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const values = [
        paciente.nome,
        paciente.estado,
        paciente.sexo,
        paciente.data_nascimento,
        paciente.cpf,
        paciente.contato_paciente,
        paciente.motivo_admissao,
        paciente.logradouro || '',
        paciente.cidade || '',
        paciente.cep || ''
    ];

    const result = await db.query(query, values);
    return result.rows[0];
}

async function findAll() {
    const result = await db.query('SELECT id, nome, estado, sexo, data_nascimento, cpf, contato_paciente, motivo_admissao, logradouro, cidade, cep FROM pacientes ORDER BY id DESC');
    return result.rows;
}

async function findByNome(nome) {
    const result = await db.query(
        'SELECT id, nome, estado, sexo, data_nascimento, cpf, contato_paciente, motivo_admissao, logradouro, cidade, cep FROM pacientes WHERE LOWER(nome) LIKE LOWER($1) ORDER BY id DESC',
        [`%${nome}%`]
    );
    return result.rows;
}

async function remove(id) {
    await db.query('DELETE FROM pacientes WHERE id = $1', [id]);
}

module.exports = {
    create,
    findAll,
    findByNome,
    remove
};