# UTI Digital - Sistema de Gestão de UTI

<p align="center">
  <img src="uploads/images/ui.png" alt="UTI Digital Logo" width="150">
</p>

Sistema web completo para gerenciamento de Unidade de Terapia Intensiva (UTI), desenvolvido como Trabalho de Conclusão de Curso (TCC). O sistema permite o controle completo de leitos hospitalares, cadastro de pacientes, registro de medições de sinais vitais e geração automática de alertas para estados críticos.

---

## 1. Sumário

1. [Introdução](#1-introdução)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#3-tecnologias-utilizadas)
4. [Estrutura de Diretórios](#4-estrutura-de-diretórios)
5. [Banco de Dados](#5-banco-de-dados)
6. [APIs RESTful](#6-apis-restful)
7. [Frontend - Páginas HTML](#7-frontend---páginas-html)
8. [Autenticação e Autorização](#8-autenticação-e-autorização)
9. [Funcionalidades do Sistema](#9-funcionalidades-do-sistema)
10. [Regras de Negócio](#10-regras-de-negócio)
11. [Configuração e Execução](#11-configuração-e-execução)
12. [Usuários de Teste](#12-usuários-de-teste)
13. [Fluxo de Uso](#13-fluxo-de-uso)
14. [Decisões de Design](#14-decisões-de-design)
15. [Installation and Setup](#15-installation-and-setup)

---

## 1. Introdução

O **UTI Digital** é um sistema web desenvolvido para automatizar a gestão de uma Unidade de Terapia Intensiva. O projeto surgiu da necessidade de digitalizar processos manuais de controle de leitos e registro de sinais vitais, proporcionando:

- **Visão em tempo real** da ocupação da UTI
- **Registro estruturado** de medições de sinais vitais
- **Alertas automáticos** para valores fora dos parâmetros considerados seguros
- **Histórico completo** de cada paciente internado
- **Relatórios** para análise de dados

### 1.1 Objetivo do Projeto

Desenvolver um sistema completo de gestão de UTI que permita:
- Controle de leitos (disponíveis, ocupados, indisponíveis)
- Cadastro e internação de pacientes
- Registro de medições de sinais vitais (frequência cardíaca, pressão arterial, SpO2, temperatura)
- Geração automática de alertas para estados críticos
- Dashboard com estatísticas em tempo real

---

## 2. Arquitetura do Sistema

O sistema segue uma arquitetura **RESTful** com separação clara entre backend e frontend:

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │Dashboard │ │Gestão de │ │Detalhe  │ │Internar  │  ...     │
│  │          │ │Leitos    │ │Leito   │ │Paciente │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘         │
│       └────────────┴────────────┴────────────┘               │
│                            │                                  │
│              Fetch API (REST) │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
┌────────────────────────────┼────���─────────────────────────────┐
│                         BACKEND                                 │
│                            ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Express.js                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                  │
│         ┌────────────────┼────────────────┐                     │
│         ▼              ▼              ▼                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│  │ Routes │ │Controllers│ │ Models  │                     │
│  └────────┘ └──────────┘ └────────┘                     │
│                            │                                  │
│                            ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              PostgreSQL (Neon DB)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 Padrão MVC

O backend implementa o padrão **MVC (Model-View-Controller)** adaptado para APIs REST:

- **Models**: Responsáveis pela comunicação direta com o banco de dados
- **Controllers**: Contêm a lógica de negócio
- **Routes**: Definem os endpoints da API

---

## 3. Tecnologias Utilizadas

### 3.1 Backend

| Tecnologia | Versão | Descrição |
|------------|--------|----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | ^4.18 | Framework web |
| **pg** | ^8.11 | Cliente PostgreSQL |
| **bcrypt** | ^5.1 | Criptografia de senhas |
| **express-session** | ^1.17 | Gerenciamento de sessões |
| **connect-flash** | ^0.1 | Mensagens flash |
| **dotenv** | ^16.0 | Variáveis de ambiente |

### 3.2 Banco de Dados

| Tecnologia | Descrição |
|------------|----------|
| **PostgreSQL** | Banco de dados relacional |
| **Neon DB** | PostgreSQL na nuvem (produção) |

### 3.3 Frontend

| Tecnologia | Descrição |
|------------|----------|
| **HTML5** | Linguagem de marcação |
| **CSS3** | Estilos (sem frameworks) |
| **JavaScript (ES6+)** | Lógica client-side |
| **Fetch API** | Comunicação com backend |

---

## 4. Estrutura de Diretórios

```
utidigital/
├── .env                           # Variáveis de ambiente
├── package.json                   # Dependências npm
├── src/
│   ├── app.js                   # Configuração principal do Express
│   ├── server.js               # Ponto de entrada
│   ├── config/
│   │   └── db.js             # Conexão PostgreSQL
│   ├── routes/                # Rotas da API
│   │   ├── authRoutes.js      # Autenticação
│   │   ├── userRoutes.js     # Usuários
│   │   ├── leitoRoutes.js   # Leitos
│   │   ├── pacienteRoutes.js # Pacientes
│   │   ├── medicaoRoutes.js # Medições
│   │   └── relatorioRoutes.js # Relatórios
│   ├── controllers/          # Lógica de negócio - o controller é responsável por receber os dados do model e retornar os dados para o view.

│   │   ├── userController.js
│   │   ├── pacienteController.js
│   │   └── medicaoController.js
│   ├── models/             # Modelos de dados - o modelo é uma classe que representa uma tabela do banco de dados. Ele é responsável por acessar o banco de dados e retornar os dados para o controller.

│   │   ├── userModel.js
│   │   ├── pacienteModel.js
│   │   └── medicaoModel.js
│   ├── middleware/         # Middleware - é uma camada de software que atua como "ponte" ou intermediário entre aplicações, ferramentas, bancos de dados ou sistemas operacionais. 
│   │   └── authMiddleware.js
│   └── scripts/            # Scripts de setup
│       ├── migrate.js
│       ├── seedLeitos.js
│       ├── seedMedicos.js
│       └── createTestUsers.js
├── public/
│   ├── html/              # Páginas HTML
│   │   ├── index.html    # Login
│   │   ├── dashboard.html
│   │   ├── gestao_leitos.html
│   │   ├── leito_detalhe.html
│   │   ├── internar_paciente.html
│   │   ├── cadastro_pacientes.html
│   │   ├── cadastro_usuarios.html
│   │   └── relatorios.html
│   ├── styles/           # Arquivos CSS
│   │   ├── global.css
│   │   ├── login_page.css
│   │   ├── gestao_leitos.css
│   │   └── ...
│   └── uploads/
│       └── images/
│           └── ui.png
└── uploads/
    └── images/
```

---

## 5. Banco de Dados

### 5.1 Tabelas do Sistema

O banco de dados PostgreSQL contém as seguintes tabelas:

```sql
-- Tabela de usuários (médicos, enfermeiros, administradores)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) NOT NULL,  -- 'Medico', 'Enfermeiro', 'Admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de leitos da UTI
CREATE TABLE leitos (
    id SERIAL PRIMARY KEY,
    numero INTEGER UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'disponivel',  -- 'disponivel', 'ocupado', 'indisponivel'
    paciente_nome VARCHAR(255),
    paciente_id INTEGER,
    data_internacao TIMESTAMP,
    data_nascimento_paciente DATE,
    cpf_paciente VARCHAR(14),
    motivo_admissao TEXT,
    observacoes TEXT,
    medico_responsavel_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pacientes
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    cpf VARCHAR(14) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de medições de sinais vitais
CREATE TABLE medicoes (
    id SERIAL PRIMARY KEY,
    leito_id INTEGER NOT NULL REFERENCES leitos(id),
    frequencia_cardiaca INTEGER,
    pressao_sistolica INTEGER,
    pressao_diastolica INTEGER,
    spo2 INTEGER,
    temperatura DECIMAL(4,1),
    observacoes TEXT,
    registrado_por INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de altas (histórico)
CREATE TABLE altas (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER,
    paciente_nome VARCHAR(255),
    data_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5.2 Relacionamentos

```
users (1) ──────► leitos
    │                  │
    │                  ▼
    │          (paciente_id) │
    │                  │
    │              pacientes
    │
    ▼
(registrado_por)
    │
    ▼
medicoes
```

---

## 6. APIs RESTful

O sistema disponibiliza as seguintes APIs RESTful:

### 6.1 Autenticação (`/auth`)

| Método | Endpoint | Descrição | Parâmetros |
|--------|---------|----------|-----------|-----------|
| POST | `/auth/login` | Login de usuário | `email`, `password`, `acesso` (perfil) |
| GET | `/auth/logout` | Logout | - |
| GET | `/auth/user` | Dados do usuário logado | - |

**Exemplo de login:**
```javascript
// Request
POST /auth/login
{
  "email": "vitor2008bergamasco@gmail.com",
  "password": "123456",
  "acesso": "Medico"
}

// Response
{
  "success": true,
  "redirect": "/dashboard"
}
```

### 6.2 Usuários (`/users`)

| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | `/users` | Listar todos os usuários |
| GET | `/users?perfil=Medico` | Listar por perfil |
| POST | `/users` | Criar novo usuário |
| DELETE | `/users/:id` | Excluir usuário |

### 6.3 Leitos (`/api/leitos`)

| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | `/api/leitos` | Listar todos os leitos |
| GET | `/api/leitos/:id` | Detalhes de um leito |
| POST | `/api/leitos` | Criar novo leito |
| PUT | `/api/leitos/:id` | Atualizar leito |
| DELETE | `/api/leitos/:id` | Excluir leito |
| POST | `/api/leitos/:id/alta` | Dar alta ao paciente |

**Exemplo - Listar leitos:**
```javascript
// GET /api/leitos

// Response
[
  {
    "id": 1,
    "numero": 1,
    "status": "ocupado",
    "paciente_nome": "João Silva",
    "paciente_id": 5,
    "data_internacao": "2024-01-15T10:00:00Z",
    "medico_responsavel_id": 1
  },
  {
    "id": 2,
    "numero": 2,
    "status": "disponivel",
    "paciente_nome": null,
    "paciente_id": null
  }
]
```

### 6.4 Pacientes (`/api/pacientes`)

| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | `/api/pacientes` | Listar pacientes (suporta busca) |
| GET | `/api/pacientes/:id` | Detalhes de um paciente |
| POST | `/api/pacientes` | Criar novo paciente |
| DELETE | `/api/pacientes/:id` | Excluir paciente |

### 6.5 Medições (`/api/medicoes`)

| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | `/api/medicoes/leito/:leitoId` | Histórico de medições |
| GET | `/api/medicoes/leito/:leitoId/latest` | Última medição |
| POST | `/api/medicoes` | Registrar nova medição |
| DELETE | `/api/medicoes/leito/:leitoId/delete` | Excluir histórico |

**Exemplo - Registrar medição:**
```javascript
// POST /api/medicoes
{
  "leito_id": 1,
  "frequencia_cardiaca": 85,
  "pressao_sistolica": 120,
  "pressao_diastolica": 80,
  "saturacao": 98,
  "temperatura": 36.5,
  "observacoes": "Paciente estável"
}
```

### 6.6 Relatórios (`/api/relatorios`)

| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | `/api/relatorios/estatisticas` | Estatísticas do dashboard |
| GET | `/api/relatorios/alertas` | Alertas de estados críticos |
| GET | `/api/relatorios/pacientes-internados` | Lista de pacientes |
| GET | `/api/relatorios/paciente/:id` | Relatório individual |

**Exemplo - Estatísticas:**
```javascript
// GET /api/relatorios/estatisticas

// Response
{
  "leitosOcupados": 15,
  "altas": 3,
  "estadosCriticos": 2
}
```

**Exemplo - Alertas:**
```javascript
// GET /api/relatorios/alertas

// Response
[
  {
    "leitoNumero": 3,
    "pacienteNome": "Maria Santos",
    "issues": [
      { "param": "PA", "value": "150/95", "normal": "< 140/90 mmHg", "status": "high" },
      { "param": "Temperatura", "value": "38.2°C", "normal": "< 37.5°C", "status": "high" }
    ]
  }
]
```

---

## 7. Frontend - Páginas HTML

O sistema possui 8 páginas HTML principais, cada uma com seu próprio script inline. Esta seção detalha cada página.

### 7.1 Abordagem de Scripts Embutidos

Cada página HTML contém seu próprio código JavaScript diretamente no arquivo, em vez de usar arquivos externos separados. Esta decisão de design foi tomada para:

1. **Autonomia**: Cada página é independente e pode funcionar isoladamente
2. **Simplicidade**: Não há necessidade de gerenciar múltiplos arquivos JS
3. **Portabilidade**: Para um TCC, facilita a apresentação e distribuição
4. **Escopo limitado**: Cada página tem funcionalidades específicas

### 7.2 Páginas do Sistema

#### **7.2.1 index.html - Login**

Página inicial de autenticação.

**Endpoints consumidos:**
- `POST /auth/login` - Autenticação

**Funcionalidades:**
- Formulário de login com email, senha e seleção de perfil
- Validação de credenciais
- Redirecionamento após login bem-sucedido

**Scripts inline:**
```javascript
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ... })
    });
    // Redireciona para dashboard
});
```

---

#### **7.2.2 dashboard.html - Painel Principal**

Dashboard com estatísticas em tempo real.

**Endpoints consumidos:**
- `GET /auth/user` - Dados do usuário logado
- `GET /api/relatorios/estatisticas` - Estatísticas gerais
- `GET /api/relatorios/alertas` - Alertas de críticos

**Funcionalidades:**
- Cards de estatísticas:
  - Leitos Ocupados
  - Altas (24h)
  - Estados Críticos
- Lista de alertas com parâmetros fora dos valores normais
- Navegação para outras páginas

**Scripts inline:**
```javascript
async function loadStats() {
    const res = await fetch('/api/relatorios/estatisticas');
    const stats = await res.json();
    // Atualiza os cards
}

async function loadAlerts() {
    const res = await fetch('/api/relatorios/alertas');
    const alerts = await res.json();
    // Renderiza alertas
}
```

---

#### **7.2.3 gestao_leitos.html - Gestão de Leitos**

CRUD de leitos da UTI.

**Endpoints consumidos:**
- `GET /auth/user` - Verifica perfil do usuário
- `GET /api/leitos` - Lista todos os leitos
- `POST /api/leitos` - Criar novo leito (Admin)
- `DELETE /api/leitos/:id` - Excluir leito (Admin)

**Funcionalidades:**
- Grid de leitos com status (disponível/ocupado/indisponível)
- Busca de leitos por número ou paciente
- **Apenas Admin:**
  - Botão "+ Adicionar Leito"
  - Botão "[Excluir]" em cada card

**Scripts inline:**
```javascript
let isUserAdmin = false;

async function loadUser() {
    const response = await fetch('/auth/user');
    const data = await response.json();
    isUserAdmin = data.user.perfil === 'Admin';
    // Configura UI conforme perfil
}

async function loadBeds() {
    const res = await fetch('/api/leitos');
    const leitos = await res.json();
    // Renderiza grid de leitos
}
```

---

#### **7.2.4 leito_detalhe.html - Detalhe do Leito**

Visualização completa de um leito e seu paciente.

**Endpoints consumidos:**
- `GET /auth/user` - Dados do usuário
- `GET /api/leitos/:id` - Dados do leito
- `GET /api/medicoes/leito/:id` - Histórico de medições
- `POST /api/medicoes` - Registrar nova medição
- `POST /api/leitos/:id/alta` - Dar alta
- `PUT /api/leitos/:id` - Atualizar leito

**Funcionalidades:**
- Dados do paciente
- Informações do leito
- Histórico de medições
- Formulário para nova medição (FC, PA, SpO2, temperatura)
- Botão de alta (apenas médico)

**Scripts inline:**
```javascript
async function loadLeito() {
    const path = window.location.pathname;
    const id = path.split('/leito/')[1];
    const res = await fetch('/api/leitos/' + id);
    const leito = await res.json();
    // Preenche dados
}

async function loadMedicoes() {
    const res = await fetch('/api/medicoes/leito/' + leitoId);
    const medicoes = await res.json();
    // Renderiza tabela
}
```

---

#### **7.2.5 internar_paciente.html - Internar Paciente**

Formulário para internar pacientes.

**Endpoints consumidos:**
- `GET /auth/user` - Dados do usuário
- `GET /api/pacientes?nome=...` -Buscar pacientes
- `POST /api/leitos` - Atualizar leito (internar)
- `POST /api/pacientes` - Criar paciente

**Funcionalidades:**
- Busca de paciente existente
- Cadastro de novo paciente
- Seleção de leito disponível
- Motivo de admissão

**Scripts inline:**
```javascript
async function searchPacientes() {
    const query = document.getElementById('search').value;
    const res = await fetch('/api/pacientes?nome=' + query);
    const pacientes = await res.json();
    // Renderiza resultados
}
```

---

#### **7.2.6 cadastro_pacientes.html - Cadastro de Pacientes**

Cadastro e listagem de pacientes.

**Endpoints consumidos:**
- `GET /auth/user` - Dados do usuário
- `GET /api/pacientes` - Listar pacientes
- `POST /api/pacientes` - Criar paciente
- `DELETE /api/pacientes/:id` - Excluir paciente

**Funcionalidades:**
- Lista de pacientes cadastrados
- Busca por nome
- Formulário para novo cadastro

---

#### **7.2.7 cadastro_usuarios.html - Cadastro de Usuários**

(Apenas Admin) CRUD de usuários do sistema.

**Endpoints consumidos:**
- `GET /auth/user` - Verifica se é admin
- `GET /users` - Listar usuários
- `POST /users` - Criar usuário
- `DELETE /users/:id` - Excluir usuário

**Funcionalidades:**
- Listar usuários por perfil
- Criar novo usuário (médico/enfermeiro/admin)
- Excluir usuário (protegido - admin geral não pode ser excluído)

---

#### **7.2.8 relatorios.html - Relatórios**

Relatórios e visualização de dados.

**Endpoints consumidos:**
- `GET /auth/user` - Dados do usuário
- `GET /api/relatorios/pacientes-internados` - Lista de internados
- `GET /api/relatorios/paciente/:id` - Relatório individual
- `GET /api/leitos` - Leitos

**Funcionalidades:**
- Lista de pacientes atualmente internados
- Relatório individual por período
- Visualização de dados

---

## 8. Autenticação e Autorização

### 8.1 Sistema de Sessão

O sistema utiliza **express-session** para gerenciar sessões:

```javascript
// src/app.js
app.use(session({
    secret: process.env.SESSION_SECRET || 'utidigital_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 3600000,  // 1 hora
        httpOnly: true,
        sameSite: 'lax'
    }
}));
```

### 8.2 Middleware de Autenticação

```javascript
// src/middleware/authMiddleware.js
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect('/');
}
```

### 8.3 Perfis de Usuário

| Perfil | Descrição | Permissões |
|--------|----------|------------|
| **Admin** | Administrador | Tudo (criar usuários, excluir leitos) |
| **Médico** | Médico | Ver pacientes, dar alta, registrar medições |
| **Enfermeiro** | Enfermeiro | Registrar medições |

### 8.4 Controle de Permissões

O controle de permissões é feito no frontend (JavaScript):

```javascript
// Exemplo em gestao_leitos.html
if (user.perfil === 'Admin') {
    document.getElementById('btnAddLeito').style.display = 'inline-block';
    document.getElementById('navCadastroUsuarios').style.display = 'flex';
}
```

---

## 9. Funcionalidades do Sistema

### 9.1 Dashboard

- **Leitos Ocupados**: Total de leitos com pacientes
- **Altas (24h)**: Altas nos últimas 24 horas
- **Estados Críticos**: Pacientes com parâmetros anormais

### 9.2 Gestão de Leitos

- Visualização em grid
- Status: disponível (verde), ocupado (vermelho), indisponível (cinza)
- Busca por número ou paciente
- **Admin**: Criar e excluir leitos
- Validação: não permite número duplicado

### 9.3 Detalhe do Leito

- Dados do paciente
- Histórico de medições
- Formulário de nova medição
- Alta do paciente (médico)

### 9.4 Internação

- Busca de paciente existente
- Cadastro rápido de novo paciente
- Seleção de leito disponível
- Motivo de admissão

### 9.5 Sistema de Alertas

O sistema gera alertas automáticos para:

| Parâmetro | Valor Normal | Tipo de Alerta |
|-----------|-------------|----------------|
| Temperatura | < 37.5°C | Acima de 37.5°C |
| Pressão Sistólica | < 140 mmHg | Acima de 140 mmHg |
| Pressão Diastólica | < 90 mmHg | Acima de 90 mmHg |
| SpO2 | 90-99% | Abaixo de 90% ou acima de 99% |
| Frequência Cardíaca | 50-100 bpm | Acima de 100 ou abaixo de 50 bpm |

---

## 10. Regras de Negócio

### 10.1 Internação

- Um paciente só pode estar internadonum único leito por vez
- O sistema impede internação dupla

### 10.2 Alta

- Ao dar alta, o paciente é removido da tabela `pacientes`
- Um registro é criado na tabela `altas`
- Todas as medições são excluídas
- O leito volta a estar disponível

### 10.3 Validações

- **Leito duplicado**: Não permite criar leito com número existente
- **Usuário protegido**: Admin geral não pode ser excluído
- **Campos obrigatórios**: Medições exigem todos os campos

---

## 11. Configuração e Execução

### 11.1 Variáveis de Ambiente

Crie um arquivo `.env`:

```env
# Conexão PostgreSQL (Neon DB)
DATABASE_URL=postgresql://usuario:senha@host:porta/database

# Chave para sessões
SESSION_SECRET=sua_chave_secreta_aqui
```

### 11.2 Instalação

```bash
# Instalar dependências
npm install

# Configurar banco
node src/scripts/migrate.js
node src/scripts/seedLeitos.js
node src/scripts/seedMedicos.js
node src/scripts/createTestUsers.js
```

### 11.3 Execução

```bash
# Iniciar servidor
node src/server.js

# Acessar
http://localhost:3000
```

---

## 12. Usuários de Teste

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | devjoaopedrofepereira2009@gmail.com | 123456 |
| Médico | joaopedroferreirapereira0701@gmail.com | 123456 |
| Enfermeiro | maria@uti.com | 123456 |

---

## 13. Fluxo de Uso

### 13.1 Fluxo Básico

```
1. Login
   ├── Dashboard (estatísticas)
   ├── Gestão de Leitos (visualizar)
   │   ├── Internar Paciente
   │   ├── Detalhe do Leito
   │   │   ├── Registrar Medição
   │   │   └── Dar Alta
   │   └── Relatórios
   └── Sair
```

### 13.2 Fluxo de Internação

```
1. Ir para "Gestão de Leitos"
2. Clicar em "+ Internar Paciente"
3. Buscar paciente existente OU cadastrar novo
4. Selecionar leito disponível
5. Preencher motivo de admissão
6. Confirmar internação
```

### 13.3 Fluxo de Medição

```
1. Ir para "Gestão de Leitos"
2. Clicar no leito ocupado
3. Preencher formulário:
   - Frequência Cardíaca
   - Pressão Sistólica
   - Pressão Diastólica
   - SpO2
   - Temperatura
4. Clicar em "Registrar"
```

---

## 14. Decisões de Design

### 14.1 Por que scripts inline?

Para este TCC, opou-se por scripts inline por:

1. **Facilidade de apresentação**: O professor pode ver tudo em um arquivo
2. **Portabilidade**: Não precisa carregar múltiplos arquivos
3. **Escopo claro**: Cada página tem suas próprias funções
4. **Simplicidade**: Ideal para projetos de escopo limitado

### 14.2 Por que vanilla JavaScript?

1. **Sem dependências frontend**: Não precisa de React/Vue/Angular
2. **Curva de aprendizado**: Demonstra conhecimento de JavaScript puro
3. **Desempenho**: Evita o sobrecarregamento de requisições, tornando o carregamento muito mais rápido do sistema.
4. **Facilidade de debugging**: Fácil de entender e depurar

### 14.3 Por que PostgreSQL?

1. **Dados estruturados**: Ideal para dados hospitalares
2. **Confiabilidade**: ACID compliance - Garante que as transações sejam processadas de forma confiável e segura.
3. **Neon DB**: PostgreSQL gerenciado na nuvem

### 14.4 Por que API RESTful?

1. **Padrão da indústria**: Facilita integração futura
2. **Separação de preocupações**: Backend separado do frontend
3. **Escalabilidade**: API pode ser usada por outros clientes

---

## 15. Installation and Setup

### 15.1 Prerequisites

- Node.js 18+
- PostgreSQL (local or Neon DB)
- npm or yarn

### 15.2 Installation Steps

```bash
# Clone repository
git clone https://github.com/your-username/utidigital.git
cd utidigital

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run database setup
node src/scripts/migrate.js
node src/scripts/seedLeitos.js
node src/scripts/seedMedicos.js
node src/scripts/createTestUsers.js

# Start server
node src/server.js

# Open browser
http://localhost:3000
```

### 15.3 Testing

Use the test accounts:
- **Admin**: devjoaopedrofepereira2009@gmail.com / 123456
- **Médico**: joaopedroferreirapereira0701@gmail.com / 123456

---

## 16. Conclusão

O UTI Digital é um sistema completo que demonstra:

- Desenvolvimento backend com Node.js e Express
- Banco de dados relacional (PostgreSQL)
- APIs RESTful
- Frontend com vanilla JavaScript
- Autenticação e autorização
- Regras de negócio para saúde

O projeto pode ser expandido com:
- Módulo de relatórios PDF
- Integração com equipamentos médicos
- App móvel para enfermeiros
- Sistema de notificações push
- Registros de auditoria

---

<p align="center">
  <strong>Desenvolvido como Trabalho de Conclusão de Curso (TCC)</strong>
</p>