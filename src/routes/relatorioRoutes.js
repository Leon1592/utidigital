const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const { authorize } = require('../middleware/authMiddleware');

router.get('/alertas', relatorioController.getAlertas);
router.get('/estatisticas', relatorioController.getEstatisticas);
router.get('/altas', relatorioController.getAltas);
router.get('/internacoes', relatorioController.getInternacoes);
router.delete('/altas/:id', authorize('Enfermeiro'), relatorioController.deleteAlta);
router.delete('/internacoes/:id', authorize('Admin', 'Enfermeiro'), relatorioController.deleteInternacao);
router.get('/pacientes-internados', relatorioController.getPacientesInternados);
router.get('/paciente/:id', relatorioController.getRelatorioPaciente);

module.exports = router;
