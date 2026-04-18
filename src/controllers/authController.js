const authService = require("../services/authService")

async function login(req, res) {
  try {
    const { email, password, acesso } = req.body

    const result = await authService.login(email, password, acesso)

    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { login }