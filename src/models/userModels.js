const db = require('../config/db');

async function create(user) {
    const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *'
    const values = [user.name, user.email]

    const result = await db.query(query, values);
    return result.rows[0]
}

async function findAll() {
    const result = await db.query('SELECT * FROM users');
    return result.rows;
}

module.exports = {
    create,
    findAll
}