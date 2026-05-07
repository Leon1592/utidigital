const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const leitoRoutes = require('./routes/leitoRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const medicaoRoutes = require('./routes/medicaoRoutes');
const { isAuthenticated } = require('./middleware/authMiddleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicPath = path.join(__dirname, '../public');
const uploadsPath = path.join(__dirname, '../uploads');
console.log('Public path:', publicPath);
console.log('Uploads path:', uploadsPath);

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'utidigital_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 3600000,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user || null;
    next();
});

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

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/api/leitos', leitoRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/medicoes', medicaoRoutes);
app.use('/api/relatorios', require('./routes/relatorioRoutes'));

app.get('/debug-session', (req, res) => {
    res.json({
        hasSession: !!req.session,
        hasUser: !!req.session?.user,
        user: req.session?.user || null,
        cookies: req.headers.cookie
    });
});

app.get('/leito/:id', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/leito_detalhe.html'));
});

app.get('/test-leito', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/test_leito.html'));
});

app.get('/internar', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/internar_paciente.html'));
});

app.get('/test-static', (req, res) => {
    const testFile = path.join(publicPath, 'styles', 'login_page.css');
    res.sendFile(testFile);
});

module.exports = app;