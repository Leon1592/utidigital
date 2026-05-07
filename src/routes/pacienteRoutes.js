const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/', pacienteController.searchPacientes);
router.post('/', pacienteController.createPaciente);
router.delete('/:id', pacienteController.deletePaciente);

module.exports = router;