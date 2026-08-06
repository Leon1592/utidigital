const leitoModel = require('../models/leitoModel');
const medicaoModel = require('../models/medicaoModel');
const altasModel = require('../models/altasModel');
const internacaoModel = require('../models/internacaoModel');
const db = require('../config/db');

async function listLeitos(req, res) {
    try {
        const leitos = await leitoModel.findAll();
        res.json(leitos);
    } catch (error) {
        console.error('Erro ao buscar leitos:', error);
        res.status(500).json({ error: 'Erro ao buscar leitos' });
    }
}

async function getLeito(req, res) {
    try {
        const { id } = req.params;
        const leito = await leitoModel.findById(id);
        if (!leito) {
            return res.status(404).json({ error: 'Leito nao encontrado' });
        }
        res.json(leito);
    } catch (error) {
        console.error('Erro ao buscar leito:', error);
        res.status(500).json({ error: 'Erro ao buscar leito' });
    }
}

async function createLeito(req, res) {
    try {
        const { numero } = req.body;

        if (!numero || !Number.isInteger(Number(numero)) || numero < 1) {
            return res.status(400).json({ error: 'Numero do leito deve ser um inteiro positivo' });
        }

        const existing = await leitoModel.findByNumero(numero);
        if (existing) {
            return res.status(400).json({ error: 'Leito ' + numero + ' ja existe' });
        }

        const leito = await leitoModel.create(req.body);
        res.json(leito);
    } catch (error) {
        console.error('Erro ao criar leito:', error);
        res.status(500).json({ error: 'Erro ao criar leito' });
    }
}

async function updateLeito(req, res) {
    try {
        const { id } = req.params;
        const leito = await leitoModel.findById(id);
        if (!leito) {
            return res.status(404).json({ error: 'Leito nao encontrado' });
        }

        const newStatus = req.body.status;
        if (newStatus !== undefined && !['disponivel', 'ocupado', 'indisponivel'].includes(newStatus)) {
            return res.status(400).json({ error: 'Status invalido' });
        }

        if (newStatus === 'indisponivel') {
            if (leito.status === 'ocupado') {
                return res.status(400).json({ error: 'Leito ocupado nao pode ficar indisponivel. De a alta ao paciente antes.' });
            }
            const motivo = (req.body.motivo_indisponivel || '').trim();
            if (!motivo) {
                return res.status(400).json({ error: 'Informe o motivo da indisponibilidade' });
            }
        }

        if (newStatus === 'ocupado') {
            if (leito.status !== 'disponivel') {
                return res.status(400).json({ error: 'Apenas leitos disponiveis podem receber pacientes' });
            }
            if (req.body.paciente_nome === undefined || req.body.paciente_id === undefined) {
                return res.status(400).json({ error: 'Informe os dados do paciente para internar' });
            }
        }

        if (newStatus === 'disponivel') {
            await leitoModel.resetPacienteData(id);
            const updated = await leitoModel.findById(id);
            return res.json(updated);
        }

        const allowedFields = ['status', 'paciente_nome', 'paciente_id', 'data_internacao', 'observacoes', 'medico_responsavel_id', 'motivo_admissao', 'data_nascimento_paciente', 'cpf_paciente', 'motivo_indisponivel'];
        const data = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                data[field] = req.body[field];
            }
        }

        const updated = await leitoModel.update(id, data);

        if (newStatus === 'ocupado') {
            await internacaoModel.createFromLeito(id);
        }

        res.json(updated);
    } catch (error) {
        console.error('Erro ao atualizar leito:', error);
        res.status(500).json({ error: 'Erro ao atualizar leito' });
    }
}

async function deleteLeito(req, res) {
    try {
        const { id } = req.params;
        await medicaoModel.deleteAllByLeito(id);
        await internacaoModel.closeByLeito(id);
        await leitoModel.remove(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir leito:', error);
        res.status(500).json({ error: 'Erro ao excluir leito' });
    }
}

async function darAlta(req, res) {
    try {
        const { id } = req.params;
        const leito = await leitoModel.findAltaInfo(id);
        if (!leito) {
            return res.status(404).json({ error: 'Leito nao encontrado' });
        }

        const { id: leitoId, numero, paciente_id, paciente_nome, data_internacao } = leito;

        if (paciente_id) {
            await altasModel.create({
                pacienteId: paciente_id,
                pacienteNome: paciente_nome,
                leitoId: leitoId,
                leitoNumero: numero,
                dataInternacao: data_internacao
            });
        }

        await internacaoModel.closeByLeito(id);
        await leitoModel.resetPacienteData(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao dar alta:', error);
        res.status(500).json({ error: 'Erro ao dar alta' });
    }
}

async function transferirLeito(req, res) {
    const client = await db.connect();
    try {
        const origemId = parseInt(req.params.id, 10);
        const destinoId = parseInt(req.body.destino_leito_id, 10);

        if (!destinoId) {
            return res.status(400).json({ error: 'Informe o leito de destino' });
        }
        if (origemId === destinoId) {
            return res.status(400).json({ error: 'O leito de destino deve ser diferente' });
        }

        const origem = await leitoModel.findById(origemId);
        if (!origem) {
            return res.status(404).json({ error: 'Leito de origem nao encontrado' });
        }
        if (origem.status !== 'ocupado') {
            return res.status(400).json({ error: 'O leito de origem nao esta ocupado' });
        }

        const destino = await leitoModel.findById(destinoId);
        if (!destino) {
            return res.status(404).json({ error: 'Leito de destino nao encontrado' });
        }
        if (destino.status !== 'disponivel') {
            return res.status(400).json({ error: 'O leito de destino deve estar disponivel' });
        }

        await client.query('BEGIN');

        await client.query(
            `UPDATE leitos SET
                status = 'ocupado',
                paciente_nome = $1,
                paciente_id = $2,
                data_internacao = $3,
                observacoes = $4,
                medico_responsavel_id = $5,
                motivo_admissao = $6,
                data_nascimento_paciente = $7,
                cpf_paciente = $8,
                motivo_indisponivel = NULL
             WHERE id = $9`,
            [origem.paciente_nome, origem.paciente_id, origem.data_internacao, origem.observacoes, origem.medico_responsavel_id, origem.motivo_admissao, origem.data_nascimento_paciente, origem.cpf_paciente, destinoId]
        );

        await client.query(
            `UPDATE leitos SET status = 'disponivel', paciente_nome = NULL, paciente_id = NULL, observacoes = '', medico_responsavel_id = NULL, motivo_admissao = NULL, data_nascimento_paciente = NULL, cpf_paciente = NULL, motivo_indisponivel = NULL WHERE id = $1`,
            [origemId]
        );

        await client.query(
            'UPDATE internacoes SET leito_id = $2, leito_numero = $3 WHERE leito_id = $1 AND data_alta IS NULL',
            [origemId, destinoId, destino.numero]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            origemNumero: origem.numero,
            destinoNumero: destino.numero,
            pacienteNome: origem.paciente_nome
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao transferir leito:', error);
        res.status(500).json({ error: 'Erro ao transferir leito' });
    } finally {
        client.release();
    }
}

module.exports = {
    listLeitos,
    getLeito,
    createLeito,
    updateLeito,
    deleteLeito,
    darAlta,
    transferirLeito
};
