require('dotenv').config({ path: __dirname + '/../../.env' });
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function listUsers() {
    try {
        const result = await pool.query('SELECT id, name, email, perfil FROM users');
        console.log('Usuários no banco:');
        console.table(result.rows);
        process.exit(0);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        process.exit(1);
    }
}

listUsers();