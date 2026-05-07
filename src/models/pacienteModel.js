const db = require('../config/db');

async function create(paciente) {
    const query = `
        INSERT INTO pacientes (nome, estado, sexo, data_nascimento, cpf, contato_paciente, motivo_admissao) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [
        paciente.nome,
        paciente.estado,
        paciente.sexo,
        paciente.data_nascimento,
        paciente.cpf,
        paciente.contato_paciente,
        paciente.motivo_admissao
    ];

    const result = await db.query(query, values);
    return result.rows[0];
}

async function findAll() {
    const result = await db.query('SELECT * FROM pacientes ORDER BY id DESC');
    return result.rows;
}

async function findByNome(nome) {
    const result = await db.query(
        'SELECT * FROM pacientes WHERE LOWER(nome) LIKE LOWER($1) ORDER BY id DESC',
        [`%${nome}%`]
    );
    return result.rows;
}

module.exports = {
    create,
    findAll,
    findByNome
};