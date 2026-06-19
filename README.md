# Gestor Financeiro — `gestor.adsimepac.com.br`

Aplicação web para controle de finanças pessoais (receitas, despesas, metas individuais e compartilhadas).

> **Subdomínio de produção sugerido:** `gestor.adsimepac.com.br`

---

## 1. Arquitetura

**Monolito com front separado** (dois containers + banco):

| Camada    | Tecnologia                                         | Pasta   |
|-----------|----------------------------------------------------|---------|
| Backend   | Java **17** + Spring Boot **3.5.11** (JPA + Flyway)| `back/` |
| Frontend  | HTML + CSS + JavaScript puro (vanilla) + Nginx     | `front/`|
| Banco     | PostgreSQL **15**                                  | (docker)|
| Admin DB  | pgAdmin 4                                          | (docker)|

Não é microservice — o backend é uma única aplicação Spring Boot. O front é estático (servido pelo Nginx) e consome a API REST do backend.

---

## 2. Banco de Dados

- **SGBD:** PostgreSQL 15
- **Nome do banco:** `gfd_db`
- **Usuário:** `gestor`
- **Senha:** `banana@caramelizada`
- **Porta (host):** `5433` → `5432` (container)

### Schema

As tabelas são criadas automaticamente na primeira execução pelo **Flyway**, a partir dos scripts em `back/src/main/resources/db/migration/`:

- `V1__criacao_tabelas_iniciais.sql` — cria `usuarios`, `categorias`, `transacoes`, `metas`, `meta_usuario`.
- `V2__seed_categorias.sql` — popula categorias padrão (Salário, Investimentos, Alimentação, Transporte, Moradia, Saúde, Lazer, Educação, etc.).

Não há SQL separado para subir manualmente — o Flyway cuida da migração ao iniciar o backend.

---

## 3. Portas

| Serviço            | Porta no host | Porta no container |
|--------------------|---------------|--------------------|
| PostgreSQL         | `5433`        | `5432`             |
| pgAdmin            | `8080`        | `80`               |
| Backend (Spring)   | `8081`        | `8081`             |
| Frontend (Nginx)   | `8082`        | `80`               |

---

## 4. Como subir (Docker Compose)

Pré-requisitos: Docker + Docker Compose instalados.

```bash
# na raiz do projeto
docker compose up -d --build
```

Endpoints após subir:

- Frontend: <http://localhost:8082>
- API backend: <http://localhost:8081>
- pgAdmin: <http://localhost:8080>
- Postgres: `localhost:5433` (cliente externo)

Para derrubar:

```bash
docker compose down            # mantém os dados
docker compose down -v         # apaga o volume do Postgres
```

### Dockerfiles

- `back/Dockerfile` — build multi-stage: Maven 3.9 + Temurin 17 → runtime `eclipse-temurin:17-jre-alpine`.
- `front/Dockerfile` — `nginx:1.27-alpine` servindo `static/`, `styles/`, `scripts/` com `nginx.conf` customizado.

---

## 5. Acesso para Teste

Não há usuário pré-cadastrado via seed. O acesso é planejado assim:

1. Acesse <http://localhost:8082> — você cai na tela de login.
2. Clique em **Cadastrar** e crie um usuário (nome, e-mail, senha).
3. Faça login com o usuário criado.

### Acesso ao pgAdmin (para inspeção do banco)

- URL: <http://localhost:8080>
- E-mail: `midinatto@gmail.com`
- Senha: `F1n@nc@s`

Dentro do pgAdmin, registre um servidor com:

- Host: `db`
- Porta: `5432`
- Usuário: `gestor`
- Senha: `banana@caramelizada`
- Banco: `gfd_db`

---

## 6. Estrutura do Projeto

```
gestor/
├── back/                          # Spring Boot (Java 17)
│   ├── src/main/java/com/imepac/gestorfinanceiro/
│   │   ├── config/  controller/  dto/  model/  repository/  service/
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── db/migration/          # Flyway (V1, V2)
│   ├── Dockerfile
│   └── pom.xml
├── front/                         # HTML/CSS/JS estático + Nginx
│   ├── static/    (login, cadastro, home, gastos, metas, perfil, ...)
│   ├── styles/    (global.css, auth.css)
│   ├── scripts/   (api.js, auth.js, login.js, ...)
│   ├── nginx.conf
│   └── Dockerfile
└── docker-compose.yml
```

---

## 7. Contato

Em caso de erro, dúvida ou bug, falar com:

**Mirella Fernandes Dinatto**
GitHub: <https://github.com/midinatto>
Repositório: <https://github.com/midinatto/Gestor>
