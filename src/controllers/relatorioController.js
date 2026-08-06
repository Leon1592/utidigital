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
        console.error('Erro ao buscar alertas:', error);
        res.status(500).json({ error: 'Erro ao buscar alertas' });
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

async function getAltas(req, res) {
    try {
        const altas = await altasModel.findAllWithPaciente();
        res.json(altas);
    } catch (error) {
        console.error('Erro ao buscar altas:', error);
        res.status(500).json({ error: 'Erro ao buscar altas' });
    }
}

async function deleteAlta(req, res) {
    try {
        const { id } = req.params;
        const alta = await altasModel.findById(id);
        if (!alta) {
            return res.status(404).json({ error: 'Alta nao encontrada' });
        }

        if (alta.paciente_id) {
            const leito = await leitoModel.findByPacienteId(alta.paciente_id);
            if (leito) {
                return res.status(400).json({ error: 'Paciente esta internado e nao pode ser excluido' });
            }
            await pacienteModel.remove(alta.paciente_id);
            await altasModel.removeByPaciente(alta.paciente_id);
        } else {
            await altasModel.removeById(id);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir alta:', error);
        res.status(500).json({ error: 'Erro ao excluir alta' });
    }
}

async function getRelatorioPaciente(req, res) {
    try {
        const { id } = req.params;
        const periodoRaw = req.query.periodo;
        let periodo = null;
        if (periodoRaw && periodoRaw !== 'completo') {
            const p = parseInt(periodoRaw, 10);
            if (!isNaN(p) && p > 0) periodo = p;
        }

        const paciente = await pacienteModel.findById(id);

        // Paciente internado: relatório usa os dados atuais do leito
        let leito = await leitoModel.findByPacienteId(id);
        let leitoId = leito?.id;
        let dataInternacao = leito?.data_internacao || null;
        let medicoes = [];

        if (leitoId) {
            if (periodo) {
                medicoes = await medicaoModel.findByLeitoWithPeriod(leitoId, periodo);
            } else if (dataInternacao) {
                medicoes = await medicaoModel.findByLeitoBetween(leitoId, dataInternacao, null);
            } else {
                medicoes = await medicaoModel.findByLeito(leitoId);
            }
        } else {
            // Paciente recebeu alta: usa o registro de alta para buscar os dados
            const alta = await altasModel.findLatestByPaciente(id);
            if (alta && alta.leito_id) {
                leitoId = alta.leito_id;
                dataInternacao = alta.data_internacao || null;
                let from = dataInternacao;
                let to = alta.data_alta || null;

                if (periodo && to) {
                    const fromPeriodo = new Date(new Date(to).getTime() - periodo * 24 * 60 * 60 * 1000);
                    if (!from || fromPeriodo > new Date(from)) {
                        from = fromPeriodo.toISOString();
                    }
                }

                medicoes = await medicaoModel.findByLeitoBetween(leitoId, from, to);
                leito = {
                    id: alta.leito_id,
                    numero: alta.leito_numero || null,
                    medico_responsavel_nome: null,
                    data_internacao: dataInternacao
                };
            }
        }

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
    getAltas,
    deleteAlta,
    getRelatorioPaciente
};
