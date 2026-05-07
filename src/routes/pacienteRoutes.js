const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/', pacienteController.searchPacientes);
router.post('/', pacienteController.createPaciente);

module.exports = router;