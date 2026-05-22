function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect('/');
}

function authorize(...perfis) {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: 'Nao autenticado' });
        }
        if (!perfis.includes(req.session.user.perfil)) {
            return res.status(403).json({ error: 'Acesso nao autorizado' });
        }
        next();
    };
}

module.exports = { isAuthenticated, authorize };