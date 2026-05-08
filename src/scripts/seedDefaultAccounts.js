require('dotenv').config({ path: __dirname + '/../../.env' });
const bcrypt = require('bcrypt');
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function seedDefaultAccounts() {
    try {
        const password = await bcrypt.hash('654321', 10);

        const users = [
            { name: 'Admin Sistema', email: 'adminsistemageral@uti.com', perfil: 'Admin' },
            { name: 'Dr. Teste', email: 'medicoteste@uti.com', perfil: 'Medico' },
            { name: 'Enfermeiro Teste', email: 'enfermeiroteste@uti.com', perfil: 'Enfermeiro' }
        ];

        for (const user of users) {
            const checkResult = await pool.query(
                'SELECT id FROM users WHERE email = $1',
                [user.email]
            );

            if (checkResult.rows.length > 0) {
                await pool.query(
                    'UPDATE users SET name = $1, perfil = $2, password = $3 WHERE email = $4',
                    [user.name, user.perfil, password, user.email]
                );
                console.log(`Usuário ${user.email} atualizado com sucesso!`);
                continue;
            }

            await pool.query(
                'INSERT INTO users (name, email, perfil, password) VALUES ($1, $2, $3, $4)',
                [user.name, user.email, user.perfil, password]
            );

            console.log(`Usuário ${user.name} cadastrado com sucesso!`);
        }

        console.log('\nContas padrão criadas com sucesso!');
        console.log('Admin: adminsistemageral@uti.com / 654321');
        console.log('Médico: medicoteste@uti.com / 654321');
        console.log('Enfermeiro: enfermeiroteste@uti.com / 654321');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao criar usuários:', error);
        process.exit(1);
    }
}

seedDefaultAccounts();