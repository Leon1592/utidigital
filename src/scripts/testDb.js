require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function createUsers() {
    try {
        const password = await bcrypt.hash('123456', 10);
        
        await pool.query(
            'INSERT INTO users (name, email, perfil, password) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
            ['Dr. João Pedro', 'joaopedroferreirapereira0701@gmail.com', 'Medico', password]
        );
        
        await pool.query(
            'INSERT INTO users (name, email, perfil, password) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
            ['Enf. Maria Santos', 'maria@uti.com', 'Enfermeiro', password]
        );
        
        await pool.query(
            'INSERT INTO users (name, email, perfil, password) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
            ['Admin Sistema', 'devjoaopedrofepereira2009@gmail.com', 'Admin', password]
        );

        console.log('Usuários criados com sucesso!');
        
        const result = await pool.query('SELECT * FROM users');
        console.log(result.rows);
        
        process.exit(0);
    } catch (error) {
        console.error('Erro:', error.message);
        process.exit(1);
    }
}

createUsers();