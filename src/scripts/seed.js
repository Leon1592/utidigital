require('dotenv').config({ path: __dirname + '/../../.env' });
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const leitoModel = require('../models/leitoModel');
const pacienteModel = require('../models/pacienteModel');
const medicaoModel = require('../models/medicaoModel');

async function seed() {
    try {
        // ========== USUARIOS ==========
        const password = await bcrypt.hash('654321', 10);

        const users = [
            { name: 'Admin Sistema', email: 'adminsistemageral@uti.com', perfil: 'Admin', password },
            { name: 'Dr. Carlos Almeida', email: 'medicoteste@uti.com', perfil: 'Medico', password },
            { name: 'Enf. Juliana Santos', email: 'enfermeiroteste@uti.com', perfil: 'Enfermeiro', password }
        ];

        for (const user of users) {
            const existing = await userModel.findByEmail(user.email);
            if (!existing) {
                await userModel.create(user);
                console.log(`Usuario criado: ${user.name} (${user.perfil})`);
            } else {
                console.log(`Usuario ja existe: ${user.name}`);
            }
        }

        // ========== LEITOS ==========
        const medicos = await userModel.findByPerfil('Medico');
        const medicoId = medicos[0]?.id;

        for (let i = 1; i <= 10; i++) {
            const existing = await leitoModel.findByNumero(i);
            if (!existing) {
                await leitoModel.create({ numero: i, status: 'disponivel' });
                console.log(`Leito ${i} criado`);
            } else {
                console.log(`Leito ${i} ja existe`);
            }
        }

        // ========== PACIENTES ==========
        const pacientesData = [
            { nome: 'Joao Silva', estado: 'SP', sexo: 'Masculino', data_nascimento: '1980-05-15', cpf: '123.456.789-01', contato_paciente: '(11) 99999-0001', motivo_admissao: 'Infarto agudo do miocardio' },
            { nome: 'Maria Oliveira', estado: 'RJ', sexo: 'Feminino', data_nascimento: '1992-08-22', cpf: '987.654.321-02', contato_paciente: '(21) 98888-0002', motivo_admissao: 'AVC isquemico' },
            { nome: 'Pedro Costa', estado: 'MG', sexo: 'Masculino', data_nascimento: '1975-12-01', cpf: '456.789.123-03', contato_paciente: '(31) 97777-0003', motivo_admissao: 'Pneumonia bacteriana' },
            { nome: 'Ana Beatriz', estado: 'SP', sexo: 'Feminino', data_nascimento: '1988-03-10', cpf: '321.654.987-04', contato_paciente: '(11) 96666-0004', motivo_admissao: 'Insuficiencia cardiaca' },
            { nome: 'Lucas Pereira', estado: 'PR', sexo: 'Masculino', data_nascimento: '1995-07-20', cpf: '159.753.486-05', contato_paciente: '(41) 95555-0005', motivo_admissao: 'Sepse de foco pulmonar' }
        ];

        const createdPacientes = [];
        for (const p of pacientesData) {
            const existing = await pacienteModel.findByNome(p.nome);
            if (existing.length === 0) {
                const created = await pacienteModel.create(p);
                createdPacientes.push(created);
                console.log(`Paciente criado: ${created.nome}`);
            } else {
                createdPacientes.push(existing[0]);
                console.log(`Paciente ja existe: ${p.nome}`);
            }
        }

        // ========== INTERNAR PACIENTES NOS LEITOS 1-5 ==========
        const internacaoDate = new Date();
        internacaoDate.setDate(internacaoDate.getDate() - 2);

        for (let i = 0; i < Math.min(createdPacientes.length, 5); i++) {
            const leito = await leitoModel.findByNumero(i + 1);
            const paciente = createdPacientes[i];
            if (leito && paciente && leito.status !== 'ocupado') {
                await leitoModel.update(leito.id, {
                    status: 'ocupado',
                    paciente_nome: paciente.nome,
                    paciente_id: paciente.id,
                    medico_responsavel_id: medicoId,
                    motivo_admissao: paciente.motivo_admissao,
                    data_nascimento_paciente: paciente.data_nascimento,
                    cpf_paciente: paciente.cpf,
                    data_internacao: internacaoDate.toISOString(),
                    observacoes: ''
                });
                console.log(`Paciente ${paciente.nome} internado no leito ${i + 1}`);

                // ========== MEDICOES DE EXEMPLO ==========
                const medicoesData = [
                    { leito_id: leito.id, frequencia_cardiaca: 88, pressao_sistolica: 135, pressao_diastolica: 85, saturacao: 97, temperatura: 36.8, observacoes: 'Paciente consciente, orientado', registrado_por: medicoId },
                    { leito_id: leito.id, frequencia_cardiaca: 92, pressao_sistolica: 142, pressao_diastolica: 88, saturacao: 96, temperatura: 37.1, observacoes: 'PA levemente elevada, monitorar', registrado_por: medicoId },
                    { leito_id: leito.id, frequencia_cardiaca: 76, pressao_sistolica: 128, pressao_diastolica: 82, saturacao: 98, temperatura: 36.5, observacoes: 'Estavel, sem intercorrencias', registrado_por: medicoId }
                ];

                for (const m of medicoesData) {
                    await medicaoModel.create(m);
                }
                console.log(`3 medicoes registradas para leito ${i + 1}`);
            }
        }

        console.log('\n========================================');
        console.log('  Seed concluido com sucesso!');
        console.log('========================================');
        console.log('  Admin:     adminsistemageral@uti.com / 654321');
        console.log('  Medico:    medicoteste@uti.com / 654321');
        console.log('  Enfermeiro: enfermeiroteste@uti.com / 654321');
        console.log('========================================');

        process.exit(0);
    } catch (error) {
        console.error('Erro no seed:', error);
        process.exit(1);
    }
}

seed();
