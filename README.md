# Barras & Lotes — Setor de Pintura

Sistema de controle de produção do setor de pintura: lançamentos diários de
peças (peça, lote, horário, barras usadas), sobras, paradas de produção,
catálogo de peças com embalagem, e ordens de produção — com controle de
acesso por papel (`ADMIN` / `OPERADOR`).

Este repositório é um **monorepo**, organizado por pastas:

```
pintura-po/
├── Front-End/     # aplicação React + Vite (interface do sistema)
├── Back-End/      # API em Spring Boot (em construção)
├── database/      # documentação do modelo de dados / migrations (em construção)
└── docs/          # capturas de tela e documentação geral
```

## Front-End

React + Vite, hoje funcionando com os dados apenas na memória do navegador
(sem persistir entre sessões). Veja [`Front-End/README.md`](./Front-End/README.md)
para a lista completa de funcionalidades, como rodar e a estrutura do código.

```bash
cd Front-End
npm install
npm run dev
```

## Back-End (em construção)

API em Spring Boot responsável por autenticação (JWT), permissões
(`ADMIN` cria/edita, `OPERADOR` só visualiza), persistência dos dados em
banco e cálculo automático de turno (manhã/tarde/noite) por lançamento.
Veja [`Back-End/README.md`](./Back-End/README.md).

## Banco de dados (em construção)

PostgreSQL, com migrations versionadas via Flyway. Veja
[`database/README.md`](./database/README.md) para o rascunho do modelo de
dados.

