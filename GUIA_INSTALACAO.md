# UTI Digital - Guia de Instalação e Execução

Este guia detalha todos os passos necessários para configurar e executar o projeto UTI Digital a partir do zero.

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js** (versão 18 ou superior)
   - Download: https://nodejs.org/
   - Verificar instalação: `node --version`

2. **PostgreSQL** (versão 14 ou superior)
   - Download: https://www.postgresql.org/download/
   - Ou usar serviço online como Neon, Supabase, Railway

3. **Git** (opcional, para clonar o repositório)
   - Download: https://git-scm.com/

---

## Passo 1: Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd utidigital
```

Ou baixe o código diretamente e extraia.

---

## Passo 2: Configurar o Banco de Dados

### Opção A: PostgreSQL Local

1. Instale o PostgreSQL
2. Durante a instalação, defina:
   - **Usuário**: `postgres`
   - **Senha**: `postgres` (ou outra de sua preferência)
   - **Porta**: `5432` (padrão)

3. Abra o pgAdmin ou linha de comando e crie um banco de dados:
   ```sql
   CREATE DATABASE utidigital;
   ```

### Opção B: PostgreSQL Online (Neon/Supabase/Railway)

1. Crie uma conta no serviço escolhido
2. Crie um novo projeto/database
3. Copie a string de conexão (formato: `postgres://user:password@host:port/database`)

---

## Passo 3: Configurar Variáveis de Ambiente

1. Na raiz do projeto, renomeie o arquivo `.env.example` para `.env`:
   ```
   mv .env.example .env
   ```

2. Edite o arquivo `.env` com suas configurações:

```env
# Conexão com o banco de dados
# Substitua com sua string de conexão
DATABASE_URL=postgres://postgres:postgres@localhost:5432/utidigital

# Chave secret para sessões (pode ser qualquer texto)
SESSION_SECRET=utidigital_secret_key_123
```

**Para PostgreSQL local com usuário/senha padrão:**
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/utidigital
```

**Para PostgreSQL online (Neon/Supabase):**
```
DATABASE_URL=postgres://usuario:senha@host:5432/database?sslmode=require
```

---

## Passo 4: Instalar Dependências

No terminal, na pasta do projeto, execute:

```bash
npm install
```

Isso instalará todas as dependências listadas no `package.json`:
- express (servidor web)
- pg (conexão PostgreSQL)
- bcrypt (criptografia de senhas)
- express-session (gerenciamento de sessões)
- dotenv (variáveis de ambiente)
- connect-flash (mensagens temporárias)

---

## Passo 5: Executar Scripts de Configuração (Opcional)

Se você quiser criar dados iniciais no banco, execute alguns scripts:

```bash
# Criar tabelas básicas
node src/scripts/migrate.js

# Criar usuário administrador principal
node src/scripts/seedAdmin.js

# Criar leitos iniciais
node src/scripts/seedLeitos.js
```

---

## Passo 6: Iniciar o Servidor

Execute o comando:

```bash
node src/server.js
```

Se tudo estiver correto, você verá:

```
Conectado com o banco de dados PostgreSQL
Servidor rodando na porta 3000
Acesse: http://localhost:3000
```

---

## Passo 7: Acessar o Sistema

Abra o navegador e vá para:

```
http://localhost:3000
```

### Credenciais de Acesso

Se você executou o script `seedAdmin.js`, terá estes usuários:

| Perfil   | Email                      | Senha   |
|----------|----------------------------|---------|
| Admin    | adminsistemageral@uti.com | admin123|
| Médico   | medico@uti.com            | 123456  |
| Enfermeiro | enfermeiro@uti.com     | 123456  |

**Nota**: Se não executou os scripts, você precisará criar usuários pelo sistema (após fazer login como Admin).

---

## Estrutura de Pastas Após Configuração

```
utidigital/
├── node_modules/      (criado pelo npm install)
├── .env               (suas configurações)
├── package.json
├── src/
│   ├── server.js
│   └── ...
└── public/
    └── ...
```

---

## Solução de Problemas

### Erro: "Cannot connect to database"
- Verifique se o PostgreSQL está rodando
- Confirme a DATABASE_URL no arquivo .env
- Verifique se o banco "utidigital" foi criado

### Erro: "Module not found"
- Execute `npm install` novamente
- Verifique se está na pasta correta do projeto

### Erro: "Port 3000 already in use"
- Altere a porta no arquivo `src/server.js`
- Ou pare o outro processo que está usando a porta

###其他 erros
- Verifique o console do terminal para mensagens de erro detalhadas
- Confirme que todas as dependências foram instaladas corretamente

---

## Comandos Úteis

```bash
# Iniciar servidor em modo de desenvolvimento
node src/server.js

# Parar servidor
Ctrl + C

# Recriar banco (se necessário)
# (cuidado: apaga todos os dados)
node src/scripts/migrate.js
```

---

## Próximos Passos

Após o sistema estar rodando:

1. **Admin**: Acesse com a conta admin, vá em "Cadastro de Usuários" e crie médicos/enfermeiros
2. **Cadastre pacientes**: Vá em "Cadastro de Pacientes"
3. **Interne pacientes**: Vá em "Gestão de Leitos" > "Internar Paciente"
4. **Registre medições**: Clique em um leito ocupado e adicione sinais vitais
5. **Gere relatórios**: Acesse "Relatórios" e crie PDFs

---

## Suporte

Se tiver dúvidas ou problemas, abra uma issue no repositório ou entre em contato com os desenvolvedores.

Boa utilização do UTI Digital!