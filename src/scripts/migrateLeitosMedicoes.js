require('dotenv').config({ path: __dirname + '/../../.env' });
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        await pool.query(`
            ALTER TABLE leitos 
            ADD COLUMN IF NOT EXISTS paciente_id INTEGER,
            ADD COLUMN IF NOT EXISTS medico_responsavel_id INTEGER,
            ADD COLUMN IF NOT EXISTS motivo_admissao TEXT,
            ADD COLUMN IF NOT EXISTS data_nascimento_paciente DATE,
            ADD COLUMN IF NOT EXISTS cpf_paciente VARCHAR(14)
        `);
        console.log('Colunas添加到leitos表完成!');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS medicoes (
                id SERIAL PRIMARY KEY,
                leito_id INTEGER NOT NULL,
                frequencia_cardiaca VARCHAR(10),
                pressao_arterial VARCHAR(20),
                saturacao VARCHAR(10),
                temperatura VARCHAR(10),
                observacoes TEXT,
                registrado_por INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabela medicoes criada com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('Erro na migracao:', error);
        process.exit(1);
    }
}

migrate();