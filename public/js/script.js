document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const acesso = document.querySelector('input[name="acesso"]:checked')?.value

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, acesso })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error)
    }

    // 🔐 salva token
    localStorage.setItem("token", data.token)

    alert("Login realizado com sucesso!")

    // redireciona (exemplo)
    window.location.href = "/pages/dashboard.html"

  } catch (error) {
    alert("Erro: " + error.message)
  }
})