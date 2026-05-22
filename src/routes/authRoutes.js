const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }
});

router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/user', authController.getUser);

module.exports = router;
