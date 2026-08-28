const pool = require('../src/config/db');

let tableReady = false;

async function ensureSessionTable() {
    if (tableReady) return;
    try {
        const result = await pool.query(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'session' AND column_name = 'sess'
        `);
        if (result.rows.length === 0) {
            await pool.query('DROP TABLE IF EXISTS "session"');
            await pool.query(`
                CREATE TABLE "session" (
                    "sid" varchar NOT NULL COLLATE "default",
                    "sess" json NOT NULL,
                    "expire" timestamp(6) NOT NULL,
                    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
                )
            `);
            await pool.query('CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")');
        }
        tableReady = true;
    } catch (err) {
        console.error('Erro ao criar tabela session:', err.message);
    }
}

module.exports = async (req, res) => {
    await ensureSessionTable();
    const app = require('../src/app');
    return app(req, res);
};
