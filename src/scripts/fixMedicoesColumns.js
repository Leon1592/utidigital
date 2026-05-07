require('dotenv').config({ path: __dirname + '/../../.env' });
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkAndFix() {
    try {
        const cols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'medicoes' 
            ORDER BY ordinal_position
        `);
        console.log('Colunas na tabela medicoes:');
        cols.rows.forEach(r => console.log(' -', r.column_name, ':', r.data_type));

        console.log('\nCorrigindo colunas faltantes...');

        await pool.query(`
            ALTER TABLE medicoes 
            ADD COLUMN IF NOT EXISTS registrado_por INTEGER,
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);
        console.log('Colunas criado: registrado_por, created_at');

        await pool.query(`
            ALTER TABLE medicoes 
            ADD COLUMN IF NOT EXISTS leito_id INTEGER NOT NULL DEFAULT 0
        `);
        console.log('Coluna leito_id fixada (se existia, nao altera)');

        console.log('\nVerificando novamente...');
        const cols2 = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'medicoes' 
            ORDER BY ordinal_position
        `);
        console.log('Colunas atuais:', cols2.rows.map(r => r.column_name).join(', '));

        process.exit(0);
    } catch (error) {
        console.error('Erro:', error);
        process.exit(1);
    }
}

checkAndFix();