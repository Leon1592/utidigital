const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');

router.get('/alertas', relatorioController.getAlertas);
router.get('/estatisticas', relatorioController.getEstatisticas);
router.get('/pacientes-internados', relatorioController.getPacientesInternados);
router.get('/paciente/:id', relatorioController.getRelatorioPaciente);

module.exports = router;
