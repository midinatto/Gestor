-- Criação da tabela de Usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Categorias (Ex: Alimentação, Lazer, Salário)
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    tipo VARCHAR(10) CHECK (tipo IN ('RECEITA', 'DESPESA'))
);

-- Transações Financeiras
CREATE TABLE transacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    categoria_id INT REFERENCES categorias(id),
    descricao TEXT,
    valor DECIMAL(10,2) NOT NULL,
    data_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo VARCHAR(10) CHECK (tipo IN ('ENTRADA', 'SAIDA'))
);

-- Metas Compartilhadas
CREATE TABLE metas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    valor_objetivo DECIMAL(10,2) NOT NULL,
    valor_atual DECIMAL(10,2) DEFAULT 0,
    data_limite DATE
);

-- Tabela de ligação para Metas em Dupla/Grupo
CREATE TABLE meta_usuario (
    meta_id INT REFERENCES metas(id),
    usuario_id INT REFERENCES usuarios(id),
    PRIMARY KEY (meta_id, usuario_id)
);