const db = require('../config/db');

async function migrate() {
    try {
        await db.query(`
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
        
        await db.query(`
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