const leitoModel = require('../models/leitoModel');
const altasModel = require('../models/altasModel');
const medicaoModel = require('../models/medicaoModel');
const pacienteModel = require('../models/pacienteModel');

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

async function getAlertas(req, res) {
    try {
        const checkBeds = await leitoModel.findAll();
        const occupiedBeds = checkBeds.filter(b => b.status === 'ocupado').slice(0, 5);

        if (occupiedBeds.length === 0) {
            return res.json([]);
        }

        const alerts = [];

        for (const bed of occupiedBeds) {
            const lastMed = await medicaoModel.getLatest(bed.id);
            if (!lastMed) continue;

            const m = lastMed;
            const issues = [];

            const hasHighSistolica = isNumeric(m.pressao_sistolica) && parseFloat(m.pressao_sistolica) > 140;
            const hasHighDiastolica = isNumeric(m.pressao_diastolica) && parseFloat(m.pressao_diastolica) > 90;

            if (hasHighSistolica || hasHighDiastolica) {
                const paValue = `${m.pressao_sistolica || 0}/${m.pressao_diastolica || 0}`;
                issues.push({ param: 'PA', value: paValue, normal: '< 140/90 mmHg', status: 'high' });
            }
            if (isNumeric(m.temperatura) && parseFloat(m.temperatura) > 37.5) {
                issues.push({ param: 'Temperatura', value: m.temperatura + '°C', normal: '< 37.5°C', status: 'high' });
            }
            if (isNumeric(m.spo2) && parseFloat(m.spo2) < 90) {
                issues.push({ param: 'SpO2', value: m.spo2 + '%', normal: '90-99%', status: 'low' });
            }
            if (isNumeric(m.spo2) && parseFloat(m.spo2) > 99) {
                issues.push({ param: 'SpO2', value: m.spo2 + '%', normal: '90-99%', status: 'high' });
            }
            if (isNumeric(m.frequencia_cardiaca) && parseFloat(m.frequencia_cardiaca) > 100) {
                issues.push({ param: 'FC', value: m.frequencia_cardiaca + ' bpm', normal: '50-100 bpm', status: 'high' });
            }
            if (isNumeric(m.frequencia_cardiaca) && parseFloat(m.frequencia_cardiaca) < 50) {
                issues.push({ param: 'FC', value: m.frequencia_cardiaca + ' bpm', normal: '50-100 bpm', status: 'low' });
            }

            if (issues.length > 0) {
                alerts.push({
                    leitoNumero: bed.numero,
                    pacienteNome: bed.paciente_nome,
                    issues
                });
            }
        }

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getEstatisticas(req, res) {
    try {
        const leitosOcupados = await leitoModel.countByStatus('ocupado');
        const altas = await altasModel.countRecent24h();
        const estadosCriticos = await medicaoModel.countCritical();

        res.json({
            leitosOcupados,
            altas,
            estadosCriticos
        });
    } catch (error) {
        console.error('Erro ao buscar estatisticas:', error);
        res.status(500).json({ error: 'Erro ao buscar estatisticas' });
    }
}

async function getPacientesInternados(req, res) {
    try {
        const pacientes = await pacienteModel.findInternados();
        res.json(pacientes);
    } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        res.status(500).json({ error: 'Erro ao buscar pacientes' });
    }
}

async function getRelatorioPaciente(req, res) {
    try {
        const { id } = req.params;
        const periodo = parseInt(req.query.periodo) || 7;

        const leito = await leitoModel.findByPacienteId(id);
        const paciente = await pacienteModel.findById(id);

        const leitoId = leito?.id;
        const dataInternacao = leito?.data_internacao;

        const medicoes = leitoId
            ? await medicaoModel.findByLeitoWithPeriod(leitoId, periodo)
            : [];

        res.json({
            paciente: { ...(paciente || {}), data_internacao: dataInternacao },
            leito: leito || null,
            medicoes
        });
    } catch (error) {
        console.error('Erro ao gerar relatorio:', error);
        res.status(500).json({ error: 'Erro ao gerar relatorio' });
    }
}

module.exports = {
    getAlertas,
    getEstatisticas,
    getPacientesInternados,
    getRelatorioPaciente
};
