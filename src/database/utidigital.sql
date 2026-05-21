-- código do PostgreSQL para o repositório do github
-- Prof. Matheus pediu pra fazer isso (fomos obrigados)

  CREATE TABLE usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL
     );
   
   CREATE TABLE administradores(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    FOREIGN KEY(id) REFERENCES usuarios(id)
  );
   
      
   CREATE TABLE medicos(
     id SERIAL PRIMARY KEY,
     nome VARCHAR(100) NOT NULL,
     email VARCHAR(150) UNIQUE NOT NULL
   );
   
   CREATE TABLE enfermeiras(
      id SERIAL PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL
   );
     
  

 CREATE TABLE pacientes(
   id SERIAL PRIMARY KEY,
   nome VARCHAR(100) NOT NULL,
   estado VARCHAR(100) NOT NULL,
   sexo VARCHAR(100) NOT NULL,
   data_nascimento DATE NOT NULL,
   cpf NUMERIC(14) NOT NULL,
   contato_paciente VARCHAR(14) NOT NULL,
   motivo_admissao VARCHAR(150) NOT NULL
);
  
 CREATE TABLE leitos (
   id SERIAL PRIMARY KEY,
   nome VARCHAR(100) NOT NULL,
   situacao VARCHAR(500) NOT NULL,
   data_internacao DATE,
   status VARCHAR(20)
 );
 
 CREATE TABLE leitos_usuarios (
     id SERIAL PRIMARY KEY,
     usuario_id INT NOT NULL,
     leito_id INT NOT NULL,
     data_entrada DATE,
     data_saida DATE,
 
     FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
     FOREIGN KEY (leito_id) REFERENCES leitos(id)

 );

CREATE TABLE medicoes (
    id SERIAL PRIMARY KEY,
    frequencia_cardiaca INTEGER NOT NULL CHECK (frequencia_cardiaca > 0),
    spo2 INTEGER NOT NULL CHECK (spo2 BETWEEN 0 AND 100),
    pressao_sistolica INTEGER NOT NULL CHECK (pressao_sistolica > 0),
    pressao_diastolica INTEGER NOT NULL CHECK (pressao_diastolica > 0),
    temperatura DECIMAL(4,1) NOT NULL CHECK (temperatura BETWEEN 30 AND 45),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
