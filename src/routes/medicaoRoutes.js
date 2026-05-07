const express = require('express');
const router = express.Router();
const medicaoController = require('../controllers/medicaoController');

router.post('/', medicaoController.createMedicao);
router.get('/leito/:leitoId', medicaoController.getMedicoesByLeito);
router.get('/leito/:leitoId/latest', medicaoController.getLatestMedicao);
router.delete('/leito/:leitoId/delete', medicaoController.deleteAllByLeito);

module.exports = router;