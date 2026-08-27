const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const flash = require('connect-flash');
const helmet = require('helmet');
const pool = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const leitoRoutes = require('./routes/leitoRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const medicaoRoutes = require('./routes/medicaoRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');
const { isAuthenticated } = require('./middleware/authMiddleware');

const app = express();
app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicPath = path.join(__dirname, '../public');

app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

const sessionMaxAge = parseInt(process.env.SESSION_MAX_AGE, 10);
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'utidigital_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: (Number.isFinite(sessionMaxAge) && sessionMaxAge > 0) ? sessionMaxAge : 3600000,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user || null;
    next();
});

app.get('/api/health', async (req, res) => {
    try {
        const hasUrl = !!process.env.DATABASE_URL;
        if (!hasUrl) return res.json({ ok: false, error: 'DATABASE_URL missing' });
        await pool.query('SELECT 1');
        res.json({ ok: true });
    } catch (err) {
        res.json({ ok: false, error: err.message });
    }
});

app.use('/auth', authRoutes);
app.use('/api/users', isAuthenticated, userRoutes);
app.use('/api/leitos', isAuthenticated, leitoRoutes);
app.use('/api/pacientes', isAuthenticated, pacienteRoutes);
app.use('/api/medicoes', isAuthenticated, medicaoRoutes);
app.use('/api/relatorios', isAuthenticated, relatorioRoutes);

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/dashboard.html'));
});
app.get('/gestao-leitos', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/gestao_leitos.html'));
});
app.get('/cadastro-pacientes', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/cadastro_pacientes.html'));
});
app.get('/cadastro-usuarios', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/cadastro_usuarios.html'));
});
app.get('/relatorios', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/relatorios.html'));
});
app.get('/historico-de-altas', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/historico_altas.html'));
});
app.get('/historico-internacoes', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/historico_internacoes.html'));
});
app.get('/leito/:id', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/leito_detalhe.html'));
});
app.get('/internar', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/internar_paciente.html'));
});

app.use((err, req, res, next) => {
    console.error(err);
    if (!res.headersSent) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = app;
