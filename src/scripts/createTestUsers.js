import db from '../db/index.js';
import bcrypt from 'bcrypt';

async function createTestUsers() {
    try {
        const password = await bcrypt.hash('123456', 10);

        const users = [
            { name: 'Dr. João Pedro', email: 'joaopedroferreirapereira0701@gmail.com', perfil: 'Medico' },
            { name: 'Enf. Maria Santos', email: 'maria@uti.com', perfil: 'Enfermeiro' },
            { name: 'Admin Sistema', email: 'devjoaopedrofepereira2009@gmail.com', perfil: 'Admin' }
        ];

        for (const user of users) {
            await db.query(
                'INSERT INTO users (name, email, perfil, password) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
                [user.name, user.email, user.perfil, password]
            );
        }

        console.log('Usuários de teste criados com sucesso!');
        console.log('Email: joaopedroferreirapereira0701@gmail.com / Senha: 123456 (Médico)');
        console.log('Email: maria@uti.com / Senha: 123456 (Enfermeiro)');
        console.log('Email: devjoaopedrofepereira2009@gmail.com / Senha: 123456 (Admin)');
    } catch (error) {
        console.error('Erro ao criar usuários:', error);
    }
}

createTestUsers();