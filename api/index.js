const app = require('../src/app');

module.exports = (req, res) => {
    try {
        app(req, res);
    } catch (err) {
        console.error('Function error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
};
