require('dotenv').config({ path: __dirname + '/../../.env' });
const bcrypt = require('bcrypt');
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function seedTestUsers() {
    try {
        const password = await bcrypt.hash('123456', 10);

        const users = [
            { name: 'Dr. Medico Teste', email: 'medicoteste@uti.com', perfil: 'Medico' },
            { name: 'Enf. Enfermeiro Teste', email: 'enfermeiroteste@uti.com', perfil: 'Enfermeiro' }
        ];

        for (const user of users) {
            const checkResult = await pool.query(
                'SELECT id FROM users WHERE email = $1',
                [user.email]
            );

            if (checkResult.rows.length > 0) {
                console.log(`Usuário de teste ${user.email} já existe. Pulando.`);
                continue;
            }

            await pool.query(
                'INSERT INTO users (name, email, perfil, password) VALUES ($1, $2, $3, $4)',
                [user.name, user.email, user.perfil, password]
            );

            console.log(`Usuário de teste ${user.name} cadastrado com sucesso!`);
        }

        console.log('Usuários de teste criados com sucesso!');
        console.log('Email: medicoteste@uti.com / Senha: 123456 (Médico)');
        console.log('Email: enfermeiroteste@uti.com / Senha: 123456 (Enfermeiro)');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao criar usuários de teste:', error);
        process.exit(1);
    }
}

seedTestUsers();