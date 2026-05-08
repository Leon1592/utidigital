require('dotenv').config({ path: __dirname + '/../../.env' });
const bcrypt = require('bcrypt');
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function seedMainUsers() {
    try {
        const password = await bcrypt.hash('123456', 10);

        const users = [
            { name: 'Dr. João Pedro', email: 'joaopedroferreirapereira0701@gmail.com', perfil: 'Medico' },
            { name: 'Admin Sistema', email: 'devjoaopedrofepereira2009@gmail.com', perfil: 'Admin' }
        ];

        for (const user of users) {
            const checkResult = await pool.query(
                'SELECT id FROM users WHERE email = $1',
                [user.email]
            );

            if (checkResult.rows.length > 0) {
                console.log(`Usuário ${user.email} já existe. Pulando.`);
                continue;
            }

            await pool.query(
                'INSERT INTO users (name, email, perfil, password) VALUES ($1, $2, $3, $4)',
                [user.name, user.email, user.perfil, password]
            );

            console.log(`Usuário principal ${user.name} cadastrado com sucesso!`);
        }

        console.log('Usuários principais criados com sucesso!');
        console.log('Email: joaopedroferreirapereira0701@gmail.com / Senha: 123456 (Médico)');
        console.log('Email: devjoaopedrofepereira2009@gmail.com / Senha: 123456 (Admin)');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao criar usuários:', error);
        process.exit(1);
    }
}

seedMainUsers();