require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
    .then(client => {
        console.log("Conectado com o banco de dados PostgreSQL");
        client.release();
    })
    .catch(err => {
        console.error("Erro ao conectar com o banco: ", err);
    });

module.exports = pool;
