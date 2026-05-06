require('dotenv').config({ path: __dirname + '/../../.env' });
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                perfil VARCHAR(50) DEFAULT 'Medico',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabela users criada com sucesso!');
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS leitos (
                id SERIAL PRIMARY KEY,
                numero INTEGER NOT NULL UNIQUE,
                status VARCHAR(20) DEFAULT 'disponivel',
                paciente_nome VARCHAR(255),
                data_internacao TIMESTAMP,
                observacoes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabela leitos criada com sucesso!');
        
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS password VARCHAR(255),
            ADD COLUMN IF NOT EXISTS perfil VARCHAR(50) DEFAULT 'Medico'
        `);
        console.log('Migração de colunas concluída!');
        process.exit(0);
    } catch (error) {
        console.error('Erro na migração:', error);
        process.exit(1);
    }
}

migrate();