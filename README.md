# UTI Digital - Sistema de Gestão de UTI

<p align="center">
  <img src="uploads/images/ui.png" alt="UTI Digital Logo" width="150">
</p>

Sistema web completo para gerenciamento de Unidade de Terapia Intensiva (UTI), desenvolvido como Trabalho de Conclusão de Curso (TCC). O sistema permite o controle completo de leitos hospitalares, cadastro de pacientes, registro de medições de sinais vitais e geração automática de alertas para estados críticos.

---

## 1. Sumário

1. [Introdução](#2-introdução)
2. [Arquitetura do Sistema](#3-arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#4-tecnologias-utilizadas)
4. [Estrutura de Diretórios](#5-estrutura-de-diretórios)
5. [Banco de Dados](#6-banco-de-dados)
6. [APIs RESTful](#7-apis-restful)
7. [Frontend - Páginas HTML](#8-frontend---páginas-html)
8. [Autenticação e Autorização](#9-autenticação-e-autorização)
9. [Segurança](#10-segurança)
10. [Funcionalidades do Sistema](#11-funcionalidades-do-sistema)
11. [Regras de Negócio](#12-regras-de-negócio)
12. [Validações](#13-validações)
13. [Configuração e Execução](#14-configuração-e-execução)
14. [Usuários de Teste](#15-usuários-de-teste)
15. [Fluxo de Uso](#16-fluxo-de-uso)
16. [Decisões de Design](#17-decisões-de-design)
17. [Geração de Relatórios em PDF](#18-geração-de-relatórios-em-pdf)
18. [Conclusão](#19-conclusão)

---

## 2. Introdução

O **UTI Digital** é um sistema web desenvolvido para automatizar a gestão de uma Unidade de Terapia Intensiva. O projeto surgiu da necessidade de digitalizar processos manuais de controle de leitos e registro de sinais vitais, proporcionando:

- **Visão em tempo real** da ocupação da UTI
- **Registro estruturado** de medições de sinais vitais
- **Alertas automáticos** para valores fora dos parâmetros considerados seguros
- **Histórico completo** de cada paciente internado
- **Relatórios** para análise de dados e geração de PDF

### 2.1 Objetivo do Projeto

Desenvolver um sistema completo de gestão de UTI que permita:

- Controle de leitos (disponíveis, ocupados, indisponíveis)
- Cadastro e internação de pacientes
- Registro de medições de sinais vitais (frequência cardíaca, pressão arterial, SpO2, temperatura)
- Geração automática de alertas para estados críticos
- Dashboard com estatísticas em tempo real
- Geração de relatórios individuais em PDF

---

## 3. Arquitetura do Sistema

O sistema segue uma arquitetura **RESTful** com separação clara entre backend e frontend, implementando o padrão **MVC (Model-View-Controller)** adaptado para APIs:

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │Dashboard │ │Gestão de │ │Detalhe   │ │Internar  │  ...     │
│  │          │ │Leitos    │ │Leito     │ │Paciente  │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘         │
│       └────────────┴────────────┴────────────┘               │
│                            │                                  │
│              Fetch API (REST) │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────┐
│                         BACKEND                               │
│                            ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   Express.js                             │  │
│  │   ┌──────────┐  ┌──────────────┐  ┌──────────┐         │  │
│  │   │  Routes  │──▶│ Controllers  │──▶│  Models  │         │  │
│  │   │ (thin)   │  │ (business    │  │  (data    │         │  │
│  │   │          │◀──│  logic)      │◀──│  access) │         │  │
│  │   └──────────┘  └──────────────┘  └─────┬────┘         │  │
│  │                                          │               │  │
│  └──────────────────────────────────────────┼───────────────┘  │
│                                             ▼                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              PostgreSQL (Neon DB)                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.1 Componentes da Arquitetura

| Camada | Responsabilidade | Diretório |
|--------|-----------------|-----------|
| **Models** | Comunicação direta com o banco de dados (consultas SQL) | `src/models/` |
| **Controllers** | Lógica de negócio, validação de campos, tratamento de erros | `src/controllers/` |
| **Routes** | Mapeamento de endpoints HTTP para controllers (roteadores finos) | `src/routes/` |
| **Middleware** | Interceptação de requisições (autenticação, sessão) | `src/middleware/` |
| **Views** | Páginas HTML com JavaScript inline + `auth.js` compartilhado | `public/html/` + `public/js/` |

### 3.2 Fluxo de uma Requisição

```
1. Navegador → GET /api/leitos
2. Express → leitoRoutes.js → controller.listLeitos
3. Controller → leitoModel.findAll()
4. Model → SQL → PostgreSQL
5. Model ← dados ← PostgreSQL
6. Controller ← dados ← Model
7. Controller → JSON response
8. Navegador ← JSON ← Controller
```

---

## 4. Tecnologias Utilizadas

### 4.1 Backend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | ^5.2 | Framework web |
| **pg** | ^8.20 | Cliente PostgreSQL |
| **bcrypt** | ^6.0 | Criptografia de senhas |
| **express-session** | ^1.19 | Gerenciamento de sessões |
| **connect-flash** | ^0.1 | Mensagens flash |
| **dotenv** | ^17.4 | Variáveis de ambiente |

### 4.2 Banco de Dados

| Tecnologia | Descrição |
|------------|-----------|
| **PostgreSQL** | Banco de dados relacional |
| **Neon DB** | PostgreSQL na nuvem (produção) |

### 4.3 Frontend

| Tecnologia | Descrição |
|------------|-----------|
| **HTML5** | Linguagem de marcação |
| **CSS3** | Estilos (sem frameworks) |
| **JavaScript (ES6+)** | Lógica client-side |
| **Fetch API** | Comunicação com backend via REST |
| **jsPDF 2.5.1** | Geração de relatórios PDF no cliente |
| **jspdf-autotable 3.5.31** | Plugin de tabelas para jsPDF |

---

## 5. Estrutura de Diretórios

```
utidigital/
│
├── .env                                # Variáveis de ambiente (não versionado)
├── .gitignore
├── package.json                        # Dependências e scripts npm
├── README.md                           # Esta documentação
│
├── src/                                # Código fonte do backend
│   │
│   ├── app.js                          # Configuração principal do Express
│   │                                   #   - Sessões, flash, middleware global
│   │                                   #   - Rotas de páginas (dashboard, leitos, etc.)
│   │                                   #   - Montagem das rotas da API com isAuthenticated
│   │
│   ├── server.js                       # Ponto de entrada (inicia o servidor)
│   │
│   ├── config/
│   │   └── db.js                       # Conexão PostgreSQL (Pool + lazy connect)
│   │
│   ├── routes/                         # Rotas da API (mapeamento thin)
│   │   ├── authRoutes.js               #   POST /login, POST /logout, GET /user
│   │   ├── userRoutes.js               #   CRUD de usuários
│   │   ├── leitoRoutes.js              #   CRUD de leitos + darAlta
│   │   ├── pacienteRoutes.js           #   CRUD de pacientes
│   │   ├── medicaoRoutes.js            #   Medições (criar, listar, deletar)
│   │   └── relatorioRoutes.js          #   Relatórios e estatísticas
│   │
│   ├── controllers/                    # Lógica de negócio
│   │   ├── authController.js           #   Login, logout, getUser
│   │   ├── userController.js           #   CRUD com validação de campos
│   │   ├── leitoController.js          #   CRUD + darAlta (coordena leito/medicoes/altas)
│   │   ├── pacienteController.js       #   CRUD com validação (CPF, data, etc.)
│   │   ├── medicaoController.js        #   CRUD com validação de ranges vitais
│   │   └── relatorioController.js      #   Alertas, estatísticas, relatórios
│   │
│   ├── models/                         # Acesso ao banco de dados
│   │   ├── userModel.js                #   findById, findByEmail, create, remove
│   │   ├── leitoModel.js               #   findAll, findById, update, resetPacienteData
│   │   ├── pacienteModel.js            #   findAll, findById, findInternados, create
│   │   ├── medicaoModel.js             #   create, getLatest, countCritical, findByLeitoWithPeriod
│   │   └── altasModel.js               #   create, countRecent24h
│   │
│   ├── middleware/
│   │   └── authMiddleware.js           # isAuthenticated (redireciona para / se não logado)
│   │
│   ├── scripts/
│   │   └── seed.js                     # Seed único: 3 users + 10 leitos + 5 pacientes + internações + medições
│   │
│   └── database/
│       └── utidigital.sql              # DDL completo do banco PostgreSQL
│
├── public/                             # Arquivos estáticos (frontend)
│   │
│   ├── js/
│   │   └── auth.js                     # loadUser() + escapeHTML() compartilhados entre 7 páginas
│   │
│   ├── html/                           # Páginas do sistema
│   │   ├── index.html                  #   Tela de login
│   │   ├── dashboard.html              #   Painel principal com estatísticas
│   │   ├── gestao_leitos.html          #   Grid de leitos com CRUD
│   │   ├── leito_detalhe.html          #   Detalhes do leito + medições + alta
│   │   ├── internar_paciente.html      #   Formulário de internação
│   │   ├── cadastro_pacientes.html     #   Cadastro e busca de pacientes
│   │   ├── cadastro_usuarios.html      #   CRUD de usuários (Admin apenas)
│   │   └── relatorios.html             #   Relatórios e geração de PDF
│   │
│   ├── styles/                         # Folhas de estilo CSS
│   │   ├── global.css                  #   Estilos globais (sidebar, header, layout)
│   │   ├── login_page.css              #   Estilo da tela de login
│   │   ├── gestao_leitos.css           #   Grid e cards de leitos
│   │   ├── cadastro_pacientes.css      #   Formulário e listagem de pacientes
│   │   ├── cadastro_usuarios.css       #   Tabs e cards de usuários
│   │   ├── internar_paciente.css       #   Formulário de internação
│   │   ├── leito_detalhe.css           #   Cards vitais e histórico
│   │   └── relatorios.css              #   Preview e controles de relatório
│   │
│   └── uploads/
│       └── images/
│           └── ui.png                  # Logo do sistema
│
└── uploads/
    └── images/
        └── ui.png                      # Logo (cópia para uploads)
```

---

## 6. Banco de Dados

### 6.1 DDL Completo

O script DDL está em `src/database/utidigital.sql`. Execute-o no PostgreSQL para criar todas as tabelas:

```sql
-- =====================
-- Tabela: users
-- =====================
-- Armazena médicos, enfermeiros e administradores do sistema.
-- A senha é armazenada com hash bcrypt.
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) DEFAULT 'Medico',   -- 'Medico', 'Enfermeiro', 'Admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Tabela: leitos
-- =====================
-- Representa cada leito da UTI. Quando ocupado, armazena os dados do
-- paciente internado (nome, ID, motivo, médico responsável, etc.).
CREATE TABLE IF NOT EXISTS leitos (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'disponivel',  -- 'disponivel', 'ocupado', 'indisponivel'
    paciente_nome VARCHAR(255),
    paciente_id INTEGER,
    data_internacao TIMESTAMP,
    observacoes TEXT,
    medico_responsavel_id INTEGER,
    motivo_admissao TEXT,
    data_nascimento_paciente DATE,
    cpf_paciente VARCHAR(14),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Tabela: pacientes
-- =====================
-- Cadastro permanente de pacientes. Ao dar alta, o registro permanece
-- nesta tabela (d sucesso do paciente transitar por múltiplas internações).
CREATE TABLE IF NOT EXISTS pacientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    estado VARCHAR(100),
    sexo VARCHAR(100),
    data_nascimento DATE,
    cpf VARCHAR(14),
    contato_paciente VARCHAR(255),
    motivo_admissao TEXT,
    logradouro VARCHAR(255),
    cidade VARCHAR(100),
    cep VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Tabela: medicoes
-- =====================
-- Registro de sinais vitais. Cada medição está vinculada a um leito
-- e opcionalmente a um usuário que a registrou.
CREATE TABLE IF NOT EXISTS medicoes (
    id SERIAL PRIMARY KEY,
    leito_id INTEGER NOT NULL,
    frequencia_cardiaca INTEGER,
    pressao_sistolica INTEGER,
    pressao_diastolica INTEGER,
    spo2 INTEGER,
    temperatura NUMERIC(4,1),
    observacoes TEXT,
    registrado_por INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Tabela: altas
-- =====================
-- Histórico de altas. Cada registro indica que um paciente recebeu alta
-- de um leito em determinada data/hora.
CREATE TABLE IF NOT EXISTS altas (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER,
    paciente_nome VARCHAR(255),
    data_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6.2 Relacionamentos entre Tabelas

```
┌─────────┐       ┌──────────────────┐       ┌───────────┐
│  users  │       │     leitos       │       │ pacientes │
├─────────┤       ├──────────────────┤       ├───────────┤
│ id      │◄──────│ medico_respons.  │       │ id        │
│ name    │       │ id               │◄──────│ paciente_ │
│ email   │       │ numero           │       │   id      │
│ perfil  │       │ status           │       │ nome      │
│ passwd  │       │ paciente_nome    │       │ cpf       │
└────┬────┘       │ paciente_id ─────┼──────►│ data_nasc │
     │            │ data_internacao  │       │ contato   │
     │            │ cpf_paciente     │       │ sexo      │
     │            │ motivo_admissao  │       │ ...       │
     │            └──────────────────┘       └───────────┘
     │                      │
     │                      │ leito_id
     │                      ▼
     │            ┌──────────────────┐       ┌───────────┐
     └────────────│    medicoes      │       │   altas   │
       registrado │                  │       ├───────────┤
       _por       │ id               │       │ id        │
                  │ leito_id         │       │ paciente_ │
                  │ frequencia_card. │       │   id      │
                  │ pressao_sist.    │       │ paciente_ │
                  │ pressao_diast.   │       │   nome    │
                  │ spo2             │       │ data_alta │
                  │ temperatura      │       └───────────┘
                  │ observacoes      │
                  │ registrado_por   │
                  └──────────────────┘
```

---

## 7. APIs RESTful

Todas as rotas da API (`/users`, `/api/*`) e páginas protegidas utilizam o middleware `isAuthenticated`. Apenas as rotas de autenticação (`/auth/login`, `/auth/logout`, `/auth/user`) e a página inicial (`/`) são públicas.

### 7.1 Autenticação (`/auth`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/login` | Login do usuário | Pública |
| POST | `/auth/logout` | Logout (destrói sessão) | Pública |
| GET | `/auth/user` | Retorna dados do usuário logado | Pública (retorna 401 se não logado) |

**Exemplo de Login:**

```javascript
// Request
POST /auth/login
{
  "email": "medicoteste@uti.com",
  "password": "654321",
  "acesso": "Medico"
}

// Response (sucesso)
{
  "success": true,
  "redirect": "/dashboard"
}

// Response (erro)
{
  "error": "Usuário não encontrado ou perfil incorreto"
}
```

**Exemplo de Logout:**

```javascript
// Request
POST /auth/logout

// Response
// Redireciona para /
```

**Exemplo de GetUser:**

```javascript
// Request
GET /auth/user

// Response
{
  "user": {
    "id": 1,
    "name": "Dr. Carlos Almeida",
    "email": "medicoteste@uti.com",
    "perfil": "Medico"
  }
}
```

### 7.2 Usuários (`/users`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Lista todos os usuários |
| GET | `/users?perfil=Medico` | Lista usuários por perfil |
| POST | `/users` | Cria novo usuário |
| DELETE | `/users/:id` | Exclui usuário |

**Exemplo de Criação:**

```javascript
// Request
POST /users
{
  "name": "Dr. João",
  "email": "joao@uti.com",
  "password": "123456",
  "perfil": "Medico"
}

// Response (sucesso - 201)
{
  "id": 4,
  "name": "Dr. João",
  "email": "joao@uti.com",
  "perfil": "Medico",
  "created_at": "2024-01-15T10:00:00.000Z"
}
```

**Validações do Controller:**
- Nome: mínimo 3 caracteres
- Email: formato válido (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Senha: mínimo 6 caracteres
- Perfil: deve ser `Medico`, `Enfermeiro` ou `Admin`

### 7.3 Leitos (`/api/leitos`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/leitos` | Lista todos os leitos |
| GET | `/api/leitos/:id` | Detalhes de um leito |
| POST | `/api/leitos` | Cria novo leito |
| PUT | `/api/leitos/:id` | Atualiza dados do leito |
| DELETE | `/api/leitos/:id` | Exclui leito (e medições associadas) |
| POST | `/api/leitos/:id/alta` | Dar alta ao paciente do leito |

**Exemplo - Listar Leitos:**

```javascript
// GET /api/leitos

// Response
[
  {
    "id": 1,
    "numero": 1,
    "status": "ocupado",
    "paciente_nome": "João Silva",
    "paciente_id": 1,
    "data_internacao": "2024-01-15T10:00:00.000Z",
    "medico_responsavel_id": 2,
    "motivo_admissao": "Infarto agudo do miocárdio",
    "data_nascimento_paciente": "1980-05-15",
    "cpf_paciente": "123.456.789-01"
  },
  {
    "id": 2,
    "numero": 2,
    "status": "disponivel",
    "paciente_nome": null,
    "paciente_id": null,
    "data_internacao": null,
    "medico_responsavel_id": null,
    "motivo_admissao": null,
    "data_nascimento_paciente": null,
    "cpf_paciente": null
  }
]
```

**Exemplo - Dar Alta:**

```javascript
// POST /api/leitos/1/alta

// Processo interno:
// 1. Busca dados do leito (paciente_id, paciente_nome)
// 2. Exclui todas as medições do leito
// 3. Cria registro na tabela altas
// 4. Remove paciente da tabela pacientes
// 5. Reseta dados do leito para disponível

// Response
{ "success": true }
```

### 7.4 Pacientes (`/api/pacientes`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pacientes` | Lista todos os pacientes |
| GET | `/api/pacientes?nome=Joao` | Busca pacientes por nome |
| GET | `/api/pacientes/:id` | Detalhes de um paciente |
| POST | `/api/pacientes` | Cria novo paciente |
| DELETE | `/api/pacientes/:id` | Exclui paciente |

**Exemplo - Criar Paciente:**

```javascript
// Request
POST /api/pacientes
{
  "nome": "Maria Oliveira",
  "data_nascimento": "1992-08-22",
  "cpf": "987.654.321-02",
  "sexo": "Feminino",
  "contato_paciente": "(21) 98888-0002",
  "estado": "RJ",
  "motivo_admissao": "AVC isquêmico",
  "logradouro": "Rua Exemplo, 123",
  "cidade": "Rio de Janeiro",
  "cep": "20000-000"
}

// Response (201)
{
  "id": 2,
  "nome": "Maria Oliveira",
  "cpf": "987.654.321-02",
  ...
}
```

**Validações do Controller:**
- Nome: mínimo 3 caracteres
- Data de nascimento: obrigatória, não pode ser futura
- CPF: formato `000.000.000-00`
- Sexo: obrigatório
- Contato: mínimo 10 dígitos

### 7.5 Medições (`/api/medicoes`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/medicoes` | Registrar nova medição |
| GET | `/api/medicoes/leito/:leitoId` | Histórico de medições de um leito |
| GET | `/api/medicoes/leito/:leitoId/latest` | Última medição registrada |
| DELETE | `/api/medicoes/leito/:leitoId/delete` | Excluir todo histórico |

**Exemplo - Registrar Medição:**

```javascript
// Request
POST /api/medicoes
{
  "leito_id": 1,
  "frequencia_cardiaca": 85,
  "pressao_sistolica": 120,
  "pressao_diastolica": 80,
  "saturacao": 98,
  "temperatura": 36.5,
  "observacoes": "Paciente estável, consciente e orientado"
}

// Response (201)
{
  "id": 45,
  "leito_id": 1,
  "frequencia_cardiaca": 85,
  "pressao_sistolica": 120,
  "pressao_diastolica": 80,
  "spo2": 98,
  "temperatura": "36.5",
  "observacoes": "Paciente estável, consciente e orientado",
  "registrado_por": 2,
  "created_at": "2024-01-17T14:30:00.000Z"
}
```

**Validações do Controller:**

| Parâmetro | Faixa Válida | Descrição |
|-----------|-------------|-----------|
| Frequência Cardíaca | 0-300 bpm | Acima de 100 = taquicardia, abaixo de 50 = bradicardia |
| Pressão Sistólica | 0-300 mmHg | Acima de 140 = hipertensão |
| Pressão Diastólica | 0-300 mmHg | Acima de 90 = hipertensão |
| SpO2 | 0-100% | Abaixo de 90 = hipóxia |
| Temperatura | 30-45 °C | Acima de 37.5 = febre |

### 7.6 Relatórios (`/api/relatorios`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/relatorios/estatisticas` | Estatísticas do dashboard |
| GET | `/api/relatorios/alertas` | Alertas de estados críticos |
| GET | `/api/relatorios/pacientes-internados` | Lista de pacientes internados |
| GET | `/api/relatorios/paciente/:id` | Relatório individual do paciente |

**Exemplo - Estatísticas:**

```javascript
// GET /api/relatorios/estatisticas

// Response
{
  "leitosOcupados": 5,      // Leitos com status 'ocupado'
  "altas": 1,               // Altas nas últimas 24 horas
  "estadosCriticos": 3      // Pacientes com ao menos 1 parâmetro crítico
}
```

**Exemplo - Alertas:**

```javascript
// GET /api/relatorios/alertas

// Response
[
  {
    "leitoNumero": 3,
    "pacienteNome": "Pedro Costa",
    "issues": [
      {
        "param": "PA",
        "value": "150/95",
        "normal": "< 140/90 mmHg",
        "status": "high"
      },
      {
        "param": "Temperatura",
        "value": "38.2°C",
        "normal": "< 37.5°C",
        "status": "high"
      }
    ]
  }
]
```

**Exemplo - Relatório Individual:**

```javascript
// GET /api/relatorios/paciente/1?periodo=7

// Response
{
  "paciente": {
    "id": 1,
    "nome": "João Silva",
    "cpf": "123.456.789-01",
    "data_internacao": "2024-01-15T10:00:00.000Z"
  },
  "leito": {
    "id": 1,
    "numero": 1,
    "medico_responsavel_nome": "Dr. Carlos Almeida"
  },
  "medicoes": [
    {
      "id": 1,
      "created_at": "2024-01-17T10:00:00.000Z",
      "frequencia_cardiaca": 88,
      "pressao_sistolica": 135,
      "pressao_diastolica": 85,
      "spo2": 97,
      "temperatura": 36.8,
      "observacoes": "Paciente consciente, orientado",
      "registrado_por_nome": "Dr. Carlos Almeida"
    }
  ]
}
```

---

## 8. Frontend - Páginas HTML

O sistema possui 8 páginas HTML que compartilham um arquivo JavaScript comum (`public/js/auth.js`) com funções de autenticação e sanitização.

### 8.1 Script Compartilhado: `public/js/auth.js`

```javascript
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function loadUser() {
    fetch('/auth/user')
        .then(response => {
            if (!response.ok) {
                window.location.href = '/';
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (!data) return;
            const user = data.user;
            // Preenche nome e perfil no header
            document.getElementById('doctorName').textContent = user.name;
            document.getElementById('roleBadge').textContent =
                perfilLabels[user.perfil] || user.perfil;
            // Mostra link de Cadastro de Usuários apenas para Admin
            document.getElementById('navCadastroUsuarios').style.display =
                user.perfil === 'Admin' ? 'flex' : 'none';
        })
        .catch(() => { window.location.href = '/'; });
}
```

### 8.2 Páginas do Sistema

#### 8.2.1 `index.html` - Tela de Login

Página inicial de autenticação. Renderiza formulário com:
- Seleção de perfil (Médico, Enfermeiro, Admin) via radio buttons
- Campo de email
- Campo de senha

**Endpoint consumido:** `POST /auth/login`

**Fluxo:**
1. Usuário preenche email, senha e seleciona perfil
2. Submit do formulário → fetch POST para `/auth/login`
3. Se sucesso → redireciona para `/dashboard`
4. Se erro → exibe mensagem de erro

#### 8.2.2 `dashboard.html` - Painel Principal

Dashboard com estatísticas em tempo real e alertas.

**Endpoints consumidos:**
- `GET /auth/user` — Identificação do usuário
- `GET /api/relatorios/estatisticas` — Cards de estatísticas
- `GET /api/relatorios/alertas` — Lista de alertas

**Funcionalidades:**
- 3 cards de estatísticas: Leitos Ocupados, Altas (24h), Estados Críticos
- Lista de alertas com parâmetros fora da faixa normal
- Navegação lateral para todas as páginas

#### 8.2.3 `gestao_leitos.html` - Gestão de Leitos

Grid visual dos leitos da UTI.

**Endpoints consumidos:**
- `GET /auth/user` — Verifica perfil (Admin vê botões extras)
- `GET /api/leitos` — Lista todos os leitos
- `POST /api/leitos` — Criar leito (Admin)
- `DELETE /api/leitos/:id` — Excluir leito (Admin)

**Funcionalidades:**
- Grid de cards com cor por status (verde=disponível, vermelho=ocupado, cinza=indisponível)
- Clique em leito ocupado → redireciona para `/leito/:id`
- Busca por número ou nome do paciente
- **Admin:** botão "+ Adicionar Leito" com modal, botão "[Excluir]" em cada card

**Tratamento de XSS:** Todos os dados inseridos via `innerHTML` usam `escapeHTML()`. onde há concatenação com dados do usuário.

#### 8.2.4 `leito_detalhe.html` - Detalhe do Leito

Página com informações completas de um leito ocupado.

**Endpoints consumidos:**
- `GET /auth/user` — Identificação
- `GET /api/leitos/:id` — Dados do leito
- `GET /api/medicoes/leito/:id` — Histórico de medições
- `POST /api/medicoes` — Registrar medição
- `POST /api/leitos/:id/alta` — Dar alta
- `DELETE /api/medicoes/leito/:id/delete` — Excluir histórico

**Funcionalidades:**
- Header com nome do paciente, idade, motivo da admissão, médico responsável, data de internação
- 4 cards de última medição (FC, PA, SpO2, Temperatura)
- Histórico completo de medições
- Formulário para registrar nova medição com validação client-side
- Botão "Dar Alta ao Paciente" com confirmação
- Botão "Excluir Histórico"

#### 8.2.5 `internar_paciente.html` - Internar Paciente

Formulário para internar paciente em um leito.

**Endpoints consumidos:**
- `GET /auth/user` — Identificação
- `GET /api/pacientes` — Listar pacientes cadastrados
- `GET /api/leitos` — Listar leitos disponíveis
- `GET /api/pacientes/:id` — Dados do paciente para internação
- `PUT /api/leitos/:id` — Atualizar leito com dados da internação

**Funcionalidades:**
- Select de pacientes cadastrados
- Select de leitos disponíveis (filtrados por status 'disponivel')
- Select de médicos responsáveis
- Campo de motivo da admissão
- Validação: paciente não pode estar já internado em outro leito

#### 8.2.6 `cadastro_pacientes.html` - Cadastro de Pacientes

Cadastro e gerenciamento de pacientes.

**Endpoints consumidos:**
- `GET /auth/user` — Identificação
- `GET /api/pacientes` — Listar pacientes
- `POST /api/pacientes` — Criar paciente
- `DELETE /api/pacientes/:id` — Excluir paciente

**Funcionalidades:**
- Formulário completo: nome, data de nascimento, CPF, sexo, CEP (com busca automática via ViaCEP), cidade, estado, logradouro, contato, motivo da admissão
- Lista de pacientes cadastrados em cards
- Busca por nome
- Modal de detalhes do paciente
- Botão de exclusão com confirmação

#### 8.2.7 `cadastro_usuarios.html` - Cadastro de Usuários

CRUD de usuários (apenas Admin).

**Endpoints consumidos:**
- `GET /auth/user` — Verifica se é Admin (redireciona se não for)
- `GET /users` — Listar usuários
- `POST /users` — Criar usuário
- `DELETE /users/:id` — Excluir usuário

**Funcionalidades:**
- 3 abas: Médicos, Enfermeiros, Administradores
- Formulário de cadastro com nome, email e senha
- Listagem de usuários com badge de perfil
- Exclusão com modal de confirmação
- Proteção: admin geral (`adminsistemageral@uti.com`) não pode ser excluído

#### 8.2.8 `relatorios.html` - Relatórios

Visualização e geração de relatórios em PDF.

**Endpoints consumidos:**
- `GET /auth/user` — Identificação
- `GET /api/relatorios/pacientes-internados` — Lista de internados
- `GET /api/relatorios/paciente/:id?periodo=X&tipo=Y` — Dados do relatório

**Funcionalidades:**
- Select de paciente internado
- Select de período (24h, 2 dias, 5 dias, 7 dias)
- 3 tipos de relatório: Completo, Sinais Vitais, Internação
- Botão de pré-visualização
- Tabela de sinais vitais + seção de observações
- Geração de PDF com jsPDF

---

## 9. Autenticação e Autorização

### 9.1 Sistema de Sessão

O sistema utiliza `express-session` com cookies HTTP-only:

```javascript
// src/app.js
app.use(session({
    secret: process.env.SESSION_SECRET || 'utidigital_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: parseInt(process.env.SESSION_MAX_AGE) || 3600000, // 1 hora
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'  // HTTPS apenas em produção
    }
}));
```

### 9.2 Middleware de Autenticação

```javascript
// src/middleware/authMiddleware.js
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect('/');
}
```

### 9.3 Perfis de Usuário

| Perfil | Descrição | Permissões |
|--------|-----------|------------|
| **Admin** | Administrador do sistema | Acesso total: CRUD de leitos, CRUD de usuários, todas as páginas |
| **Médico** | Médico da UTI | Visualizar leitos, registrar medições, dar alta |
| **Enfermeiro** | Enfermeiro da UTI | Visualizar leitos, registrar medições |

### 9.4 Proteção de Rotas

| Rota | Protegida | Observação |
|------|-----------|------------|
| `/` | Não | Página de login |
| `/auth/login` | Não | POST |
| `/auth/logout` | Não | POST |
| `/auth/user` | Não | Retorna 401 se não logado |
| `/dashboard` | Sim | Redireciona para `/` se não logado |
| `/gestao-leitos` | Sim | |
| `/cadastro-pacientes` | Sim | |
| `/cadastro-usuarios` | Sim | |
| `/relatorios` | Sim | |
| `/leito/:id` | Sim | |
| `/internar` | Sim | |
| `/users` | Sim | API |
| `/api/*` | Sim | Todas as rotas de API |

---

## 10. Segurança

### 10.1 Proteção CSRF - Logout via POST

O logout é feito exclusivamente via `POST /auth/logout` usando um formulário HTML. Links `<a href="/auth/logout">` não funcionam mais, prevenindo logout acidental por CSRF.

### 10.2 Anti-XSS via escapeHTML()

Todas as páginas HTML utilizam a função `escapeHTML()` para sanitizar dados do usuário antes de inseri-los no DOM via `innerHTML`.

```javascript
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
```

### 10.3 Ocultação de Erros Internos

Os controllers retornam mensagens de erro genéricas ao cliente. Detalhes internos (como `error.message`) são logados no servidor mas nunca expostos na resposta HTTP.

```javascript
// ❌ Antes (vazava detalhes internos)
catch (error) {
    res.status(500).json({ error: error.message });
}

// ✅ Depois (mensagem genérica)
catch (error) {
    console.error('Erro ao buscar usuarios:', error);
    res.status(500).json({ error: 'Erro ao buscar usuarios' });
}
```

### 10.4 Cookie Seguro Condicional

O cookie de sessão usa `secure: true` apenas quando `NODE_ENV=production` (HTTPS). Em desenvolvimento (HTTP local), fica como `false` para funcionar sem certificado SSL.

### 10.5 Hashing de Senhas

Todas as senhas são armazenadas com bcrypt (cost factor 10). Não há armazenamento de senhas em texto plano.

### 10.6 Validação de Campos no Backend

Todos os endpoints que recebem dados do cliente validam os campos antes de persistir no banco (ver seção 13).

---

## 11. Funcionalidades do Sistema

### 11.1 Dashboard
- **Leitos Ocupados**: Total de leitos com status 'ocupado'
- **Altas (24h)**: Altas registradas nas últimas 24 horas
- **Estados Críticos**: Pacientes com ao menos 1 parâmetro fora da faixa normal
- **Alertas**: Lista detalhada com parâmetro, valor atual e valor normal

### 11.2 Gestão de Leitos
- Visualização em grid com cores por status
- Status: disponível (verde), ocupado (vermelho), indisponível (cinza)
- Clique em leito ocupado → detalhes
- Busca por número do leito ou nome do paciente
- Admin: criar e excluir leitos

### 11.3 Detalhe do Leito
- Dados completos do paciente internado
- 4 cards com a última medição de cada parâmetro
- Histórico completo de medições em ordem cronológica
- Formulário de registro de nova medição
- Alta do paciente (remove medições, registra alta, libera leito)

### 11.4 Internação
- Busca de paciente já cadastrado
- Seleção de leito disponível
- Seleção de médico responsável
- Validação: paciente não pode estar internado em outro leito

### 11.5 Sistema de Alertas

O sistema gera alertas automáticos para parâmetros fora da faixa normal:

| Parâmetro | Faixa Normal | Tipo de Alerta | Condição |
|-----------|-------------|----------------|----------|
| Temperatura | < 37.5°C | ALTO | > 37.5°C |
| Pressão Sistólica | < 140 mmHg | ALTO | > 140 mmHg |
| Pressão Diastólica | < 90 mmHg | ALTO | > 90 mmHg |
| SpO2 | 90-99% | BAIXO | < 90% |
| SpO2 | 90-99% | ALTO | > 99% |
| Frequência Cardíaca | 50-100 bpm | ALTO | > 100 bpm |
| Frequência Cardíaca | 50-100 bpm | BAIXO | < 50 bpm |

### 11.6 Relatórios
- Relatório individual por paciente
- Período selecionável (1, 2, 5 ou 7 dias)
- Três tipos: Completo, Sinais Vitais, Internação
- Pré-visualização na tela
- Exportação em PDF com jsPDF

---

## 12. Regras de Negócio

### 12.1 Internação
- Um paciente só pode estar internado em um único leito por vez
- O sistema verifica se o paciente já está internado antes de permitir nova internação
- Apenas leitos com status 'disponivel' podem receber pacientes
- Ao internar, os dados do paciente (nome, CPF, data de nascimento) são copiados para o leito

### 12.2 Alta
- Ao dar alta:
  1. Todas as medições do leito são excluídas
  2. Um registro é criado na tabela `altas` (histórico)
  3. O paciente é removido da tabela `pacientes`
  4. O leito volta ao status 'disponivel' com todos os campos resetados
- A operação é irreversível

### 12.3 Leitos
- O número do leito deve ser único
- Não é possível criar dois leitos com o mesmo número
- Ao excluir um leito, todas as medições associadas são excluídas
- A exclusão de leito não é permitida se há regras de negócio adicionais (atualmente permitida)

### 12.4 Usuários
- O admin geral (`adminsistemageral@uti.com`) não pode ser excluído
- Usuários com perfil 'Admin' podem acessar a página de cadastro de usuários
- Médicos e enfermeiros não podem criar/excluir usuários

### 12.5 Medições
- Uma medição só pode ser registrada para leitos ocupados (embora não haja validação explícita no backend, o fluxo natural impede)
- Cada medição registra opcionalmente qual usuário a realizou
- O histórico de medições pode ser excluído em massa

---

## 13. Validações

### 13.1 Validações Backend (Controllers)

**UserController:**
| Campo | Validação | Mensagem de Erro |
|-------|-----------|-------------------|
| Nome | `trim().length >= 3` | "Nome deve ter no mínimo 3 caracteres" |
| Email | Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | "Email inválido" |
| Senha | `length >= 6` | "Senha deve ter no mínimo 6 caracteres" |
| Perfil | `['Medico', 'Enfermeiro', 'Admin']` | "Perfil inválido" |

**PacienteController:**
| Campo | Validação | Mensagem de Erro |
|-------|-----------|-------------------|
| Nome | `trim().length >= 3` | "Nome deve ter no mínimo 3 caracteres" |
| Data Nascimento | `isNaN(data) || data > Date()` | "Data de nascimento inválida" |
| CPF | Regex `/^\d{3}\.\d{3}\.\d{3}-\d{2}$/` | "CPF inválido. Use o formato 000.000.000-00" |
| Sexo | Obrigatório | "Sexo é obrigatório" |
| Contato | `length >= 10` | "Contato deve ter no mínimo 10 dígitos" |

**MedicaoController:**
| Campo | Faixa Válida | Mensagem de Erro |
|-------|-------------|-------------------|
| FC | 0-300 bpm | "Frequência cardíaca inválida (0-300 bpm)" |
| PA Sistólica | 0-300 mmHg | "Pressão sistólica inválida (0-300 mmHg)" |
| PA Diastólica | 0-300 mmHg | "Pressão diastólica inválida (0-300 mmHg)" |
| SpO2 | 0-100% | "SpO2 inválido (0-100%)" |
| Temperatura | 30-45 °C | "Temperatura inválida (30-45 °C)" |

**LeitoController:**
| Campo | Validação | Mensagem de Erro |
|-------|-----------|-------------------|
| Número | `Number.isInteger && numero > 0` | "Número do leito deve ser um inteiro positivo" |
| Duplicidade | `findByNumero()` retorna null | "Leito X já existe" |

### 13.2 Validações Frontend (HTML + JS)

Além das validações backend, o frontend também valida:
- Campos obrigatórios via atributo `required`
- Padrões via `pattern` (CPF, email)
- Comprimento mínimo via `minlength`
- Validação adicional em JavaScript antes do fetch (para feedback imediato)

---

## 14. Configuração e Execução

### 14.1 Pré-requisitos

- Node.js 18+
- PostgreSQL (local ou Neon DB)
- npm (incluído com Node.js)

### 14.2 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# String de conexão PostgreSQL (Neon DB ou local)
DATABASE_URL=postgresql://usuario:senha@host:5432/database?sslmode=require

# Chave secreta para assinar cookies de sessão
SESSION_SECRET=utidigital_secret_key

# Tempo máximo de sessão em milissegundos (1 hora = 3600000)
SESSION_MAX_AGE=3600000

# Porta do servidor (3000 é o padrão se não definido)
PORT=3000

# Ambiente: 'development' ou 'production'
# Em production, cookie.secure = true (requer HTTPS)
NODE_ENV=development
```

### 14.3 Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/utidigital.git
cd utidigital

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env com as variáveis acima

# 4. Execute o DDL no PostgreSQL
#    Abra o SQL editor do Neon (ou psql) e execute:
#    o conteúdo completo de src/database/utidigital.sql

# 5. Popule o banco com dados de teste
npm run seed

# 6. Inicie o servidor
npm start

# 7. Acesse no navegador
http://localhost:3000
```

### 14.4 Scripts npm

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor na porta configurada (ou 3000) |
| `npm run seed` | Popula o banco com dados de teste |
| `npm run migrate` | Exibe instruções para execução manual do DDL |

---

## 15. Usuários de Teste

Os seguintes usuários são criados pelo `npm run seed`:

| Perfil | Nome | Email | Senha |
|--------|------|-------|-------|
| Admin | Admin Sistema | adminsistemageral@uti.com | 654321 |
| Médico | Dr. Carlos Almeida | medicoteste@uti.com | 654321 |
| Enfermeiro | Enf. Juliana Santos | enfermeiroteste@uti.com | 654321 |

Além dos usuários, o seed cria:
- **10 leitos** (1 a 10, todos configurados)
- **5 pacientes** internados nos leitos 1 a 5
- **3 medições** para cada paciente internado (15 medições no total)

---

## 16. Fluxo de Uso

### 16.1 Fluxo Básico

```
1. Acessar http://localhost:3000
   │
2. Fazer login com email + senha + perfil
   │
3. Dashboard (página inicial pós-login)
   ├── Visualizar estatísticas (leitos ocupados, altas, críticos)
   ├── Visualizar alertas de pacientes críticos
   │
4. Gestão de Leitos
   ├── Visualizar todos os leitos com status
   ├── Clicar em leito ocupado → Detalhe do Leito
   ├── Buscar leito por número ou paciente
   ├── [Admin] Adicionar novo leito
   └── [Admin] Excluir leito
       │
5. Detalhe do Leito
   ├── Visualizar dados do paciente
   ├── Visualizar última medição (4 cards)
   ├── Visualizar histórico de medições
   ├── Registrar nova medição
   ├── Excluir histórico
   └── Dar alta ao paciente
       │
6. Internar Paciente
   ├── Selecionar paciente cadastrado
   ├── Selecionar leito disponível
   ├── Selecionar médico responsável
   ├── Informar motivo da admissão
   └── Confirmar internação
       │
7. Cadastro de Pacientes
   ├── Cadastrar novo paciente
   ├── Buscar pacientes por nome
   ├── Visualizar detalhes
   └── Excluir paciente
       │
8. Cadastro de Usuários (Admin apenas)
   ├── Abas: Médicos, Enfermeiros, Administradores
   ├── Cadastrar novo usuário
   └── Excluir usuário
       │
9. Relatórios
   ├── Selecionar paciente internado
   ├── Selecionar período
   ├── Selecionar tipo de relatório
   ├── Visualizar prévia
   └── Gerar PDF
       │
10. Sair (logout)
```

### 16.2 Fluxo de Internação Detalhado

```
1. Navegar para "Gestão de Leitos"
2. Clicar em "+ Internar Paciente"
3. Selecionar paciente no dropdown (ou cadastrar novo antes)
4. Selecionar leito disponível (apenas leitos com status 'disponivel')
5. Selecionar médico responsável
6. Preencher motivo da admissão (mínimo 5 caracteres)
7. Clicar em "Internar Paciente"
8. Sistema verifica se paciente já está internado
9. Se tudo OK → leito atualizado para 'ocupado' com dados do paciente
10. Redirecionamento automático para Gestão de Leitos
```

### 16.3 Fluxo de Medição Detalhado

```
1. Navegar para "Gestão de Leitos"
2. Clicar em leito ocupado (vermelho)
3. Na página de detalhes, rolar até "Registrar Medição"
4. Preencher:
   - Frequência Cardíaca (0-300 bpm)
   - PA Sistólica (0-300 mmHg)
   - PA Diastólica (0-300 mmHg)
   - SpO2 (0-100%)
   - Temperatura (30-45 °C)
   - Observações (opcional)
5. Clicar em "Registrar Medição"
6. Mensagem de sucesso por 3 segundos
7. Histórico é atualizado automaticamente
```

### 16.4 Fluxo de Alta Detalhado

```
1. Navegar para "Gestão de Leitos"
2. Clicar em leito ocupado
3. Clicar em "Dar Alta ao Paciente"
4. Confirmar na caixa de diálogo
5. Sistema executa:
   a. Exclui todas as medições do leito
   b. Cria registro na tabela altas
   c. Remove paciente da tabela pacientes
   d. Reseta leito para 'disponivel'
6. Redirecionamento automático para Gestão de Leitos
```

---

## 17. Decisões de Design

### 17.1 Por que MVC com controllers espessos?

Optou-se por colocar a lógica de negócio nos controllers em vez de nos models ou routes porque:
- **Routes** devem ser finas (apenas mapeamento HTTP → controller)
- **Models** devem ser responsáveis apenas por acesso a dados (SQL)
- **Controllers** são o local natural para validação, tratamento de erros e coordenação entre models

### 17.2 Por que JavaScript puro no frontend?

1. **Sem dependências**: Não requer React, Vue ou Angular
2. **Curva de aprendizado**: Demonstra conhecimento de JavaScript puro
3. **Desempenho**: Carregamento rápido sem bundle
4. **Simplicidade**: Ideal para TCC com escopo definido

### 17.3 Por que scripts inline + auth.js compartilhado?

Originalmente cada página tinha sua própria função `loadUser()`, resultando em 7 cópias do mesmo código. A refatoração moveu a função para `public/js/auth.js`, que é carregado em todas as páginas. Páginas que precisam de lógica Admin-specific mantêm seu próprio `loadUser()` que sobrescreve o compartilhado.

### 17.4 Por que escapeHTML() em vez de textContent puro?

Algumas páginas constroem HTML dinâmico com `innerHTML` (tabelas, cards, listas). Migrar tudo para `textContent` + `createElement` exigiria reescrita extensa. A abordagem pragmática foi usar `escapeHTML()` para sanitizar dados do usuário antes de interpolar em `innerHTML`.

### 17.5 Por que lazy connect no banco?

A conexão com o PostgreSQL é feita sob demanda (no primeiro `query()`) em vez de no `require()` do módulo, para evitar timeouts na inicialização do servidor quando o banco está lento ou indisponível.

### 17.6 Por que PostgreSQL e não MySQL?

- Dados estruturados com relações complexas
- ACID compliance para transações hospitalares
- Neon DB oferece PostgreSQL gerenciado na nuvem
- Suporte a consultas avançadas com CTEs (ex: `countCritical`)

---

## 18. Geração de Relatórios em PDF

### 18.1 Visão Geral

Os relatórios em PDF são gerados inteiramente no **frontend** utilizando as bibliotecas jsPDF e jspdf-autotable. Não há processamento no backend para esta funcionalidade.

### 18.2 Bibliotecas

| Biblioteca | Versão | Descrição |
|------------|--------|-----------|
| **jsPDF** | 2.5.1 | Criação de documentos PDF via JavaScript |
| **jspdf-autotable** | 3.5.31 | Plugin para criação de tabelas dentro dos PDFs |

### 18.3 Fluxo de Geração

```
1. Usuário seleciona paciente na página Relatórios
2. Usuário escolhe o período (24h, 2 dias, 5 dias, 7 dias)
3. Usuário seleciona o tipo de relatório (Completo, Sinais Vitais, Internação)
4. Usuário clica em "Pré-visualização"
5. Sistema busca dados via API: GET /api/relatorios/paciente/:id
6. Preview é exibido na tela
7. Usuário clica em "Gerar PDF"
8. jsPDF gera o documento e faz download automático
```

### 18.4 Endpoint

```
GET /api/relatorios/paciente/:id?periodo=7&tipo=completo
```

| Parâmetro | Valores | Descrição |
|-----------|---------|-----------|
| `periodo` | 1, 2, 5, 7 | Número de dias para buscar histórico |
| `tipo` | `completo`, `sinais_vitais`, `internacao` | Tipo de relatório |

### 18.5 Estrutura do PDF

```
┌─────────────────────────────────────────────┐
│              UTI DIGITAL                    │
│           Relatório de Paciente             │
├─────────────────────────────────────────────┤
│ Paciente: [Nome do Paciente]                │
│ Leito: [Número]     Médico: [Nome]          │
│ Data Internação: [Data]                     │
├─────────────────────────────────────────────┤
│              SINAIS VITAIS                   │
│ ┌────────┬─────────┬──────────┬─────┬──────┐│
│ │Data/Hora│FC(bpm) │PA(mmHg)  │SpO2│ Temp ││
│ ├────────┼─────────┼──────────┼─────┼──────┤│
│ │ ...    │  ...    │   ...    │ ... │  ... ││
│ └────────┴─────────┴──────────┴─────┴──────┘│
├─────────────────────────────────────────────┤
│            OBSERVAÇÕES                       │
│ [Lista de observações registradas]          │
├─────────────────────────────────────────────┤
│ Gerado em: [Data/Hora]                      │
└─────────────────────────────────────────────┘
```

### 18.6 Tipos de Relatório

| Tipo | Conteúdo | Uso |
|------|----------|-----|
| **Completo** | Sinais vitais + Observações médicas | Relatório detalhado para equipe |
| **Sinais Vitais** | Apenas tabela de medições | Análise rápida de tendências |
| **Internação** | Dados de admissão | Resumo do histórico do paciente |

### 18.7 Nomenclatura do Arquivo

```
relatorio_paciente_[NOME_PACIENTE].pdf

Exemplo: relatorio_paciente_Joao_Silva.pdf
```

---

## 19. Conclusão

O UTI Digital é um sistema completo que demonstra:

- **Desenvolvimento backend** com Node.js e Express (MVC, middlewares, sessões)
- **Banco de dados relacional** PostgreSQL com modelagem normalizada
- **APIs RESTful** com validação, autenticação e tratamento de erros
- **Frontend** com JavaScript puro, HTML5 semântico e CSS3
- **Segurança** com proteção CSRF, anti-XSS, hashing de senhas e ocultação de erros
- **Relatórios** em PDF gerados no cliente com jsPDF

### Possíveis Expansões Futuras

- Módulo de notificações push para alertas críticos
- Integração com equipamentos médicos (monitores cardíacos)
- Aplicativo móvel para enfermeiros (registro de medições in loco)
- Histórico completo de internações por paciente (múltiplas internações)
- Dashboard com gráficos de tendência dos sinais vitais
- Sistema de auditoria (logs de todas as operações)
- Suporte a multilíngue (português/inglês/espanhol)

---

<p align="center">
  <strong>Desenvolvido como Trabalho de Conclusão de Curso (TCC)</strong>
  <br>
  <img src="uploads/images/ui.png" alt="UTI Digital Logo" width="80">
</p>
