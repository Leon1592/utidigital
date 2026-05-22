const express = require('express');
const router = express.Router();
const leitoController = require('../controllers/leitoController');

router.get('/', leitoController.listLeitos);
router.get('/:id', leitoController.getLeito);
router.post('/', leitoController.createLeito);
router.put('/:id', leitoController.updateLeito);
router.post('/:id/alta', leitoController.darAlta);
router.delete('/:id', leitoController.deleteLeito);

module.exports = router;
