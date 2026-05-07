require('dotenv').config();
const db = require('../config/db');

async function createTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS pacientes (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            estado VARCHAR(100) NOT NULL,
            sexo VARCHAR(100) NOT NULL,
            data_nascimento DATE NOT NULL,
            cpf NUMERIC(14) NOT NULL,
            contato_paciente VARCHAR(14) NOT NULL,
            motivo_admissao VARCHAR(150) NOT NULL
        );
    `;

    try {
        await db.query(query);
        console.log('Tabela pacientes criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar tabela:', error);
    } finally {
        await db.end();
    }
}

createTable();