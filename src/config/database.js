//"npm install pg" para funcionar o PostgreSQL no Node.js

const { Pool } = require("pg")

const pool = new Pool({
    user: "postgres",
    host: "192.168.1.139",
    database: "dbutidigital",
    password: "dbutidigital1234#",
    port: 5432
})

//teste de conexão com o banco de dados
pool.connect()
    .then(client => {
        console.log("Conectado com o banco de dados PostgreSQL")
        client.release()
    })
    .catch(err => {
        console.error("Erro ao conectar com o banco: ", err)
    })

module.exports = pool
