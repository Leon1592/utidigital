require('dotenv').config({ path: __dirname + '/../../.env' });
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function seedLeitos() {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM leitos');
        const count = parseInt(result.rows[0].count);
        
        if (count > 0) {
            console.log(`Já existem ${count} leitos cadastrados. Pulando seed.`);
            process.exit(0);
        }
        
        for (let i = 1; i <= 20; i++) {
            await pool.query(
                'INSERT INTO leitos (numero, status) VALUES ($1, $2)',
                [i, 'disponivel']
            );
        }
        
        console.log('20 leitos vazios cadastrados com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao adicionar leitos:', error);
        process.exit(1);
    }
}

seedLeitos();