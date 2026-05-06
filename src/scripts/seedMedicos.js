require('dotenv').config({ path: __dirname + '/../../.env' });
const bcrypt = require('bcrypt');
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function seedMedicos() {
    try {
        const medicos = [
            { name: 'Dr. João Pedro', email: 'joaopedroferreirapereira0701@gmail.com', password: '123456' },
            { name: 'Dr. João Vitor', email: 'vitor2008bergamasco@gmail.com', password: '123456' }
        ];
        
        for (const medico of medicos) {
            const checkResult = await pool.query(
                'SELECT id FROM users WHERE email = $1',
                [medico.email]
            );
            
            if (checkResult.rows.length > 0) {
                console.log(`Médico ${medico.email} já existe. Pulando.`);
                continue;
            }
            
            const hashedPassword = await bcrypt.hash(medico.password, 10);
            
            await pool.query(
                'INSERT INTO users (name, email, password, perfil) VALUES ($1, $2, $3, $4)',
                [medico.name, medico.email, hashedPassword, 'Medico']
            );
            
            console.log(`Médico ${medico.name} cadastrado com sucesso!`);
        }
        
        console.log('Seed de médicos concluído!');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao adicionar médicos:', error);
        process.exit(1);
    }
}

seedMedicos();