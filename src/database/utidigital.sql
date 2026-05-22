-- PostgreSQL schema for UTI Digital

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) DEFAULT 'Medico',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leitos (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'disponivel',
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

CREATE TABLE IF NOT EXISTS altas (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER,
    paciente_nome VARCHAR(255),
    data_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
