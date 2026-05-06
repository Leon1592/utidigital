const pool = require('../config/db');

const db = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect(),
    end: () => pool.end()
};

module.exports = db;