const db = require('../config/db');

async function create(user) {
    const query = 'INSERT INTO users (name, email, password, perfil) VALUES ($1, $2, $3, $4) RETURNING *'
    const values = [user.name, user.email, user.password, user.perfil]

    const result = await db.query(query, values);
    return result.rows[0]
}

async function findAll() {
    const result = await db.query('SELECT id, name, email, perfil, created_at FROM users ORDER BY created_at DESC');
    return result.rows;
}

async function findByPerfil(perfil) {
    const result = await db.query(
        'SELECT id, name, email, perfil, created_at FROM users WHERE perfil = $1 ORDER BY created_at DESC',
        [perfil]
    );
    return result.rows;
}

async function remove(id) {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
}

async function findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

async function findById(id) {
    const result = await db.query('SELECT id, name, email, perfil, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
}

module.exports = {
    create,
    findAll,
    findByPerfil,
    remove,
    findByEmail,
    findById
}