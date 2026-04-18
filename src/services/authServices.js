const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function login(email, password, acesso) {
  const user = await userModel.findByEmail(email)

  if (!user) throw new Error("Usuário não encontrado")

  if (user.role !== acesso) {
    throw new Error("Perfil de acesso incorreto")
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) throw new Error("Senha inválida")

  const token = jwt.sign({ id: user.id, role: user.role }, "segredo", {
    expiresIn: "1d"
  })

  return { token }
}

module.exports = { login }