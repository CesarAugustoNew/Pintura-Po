# Grupo Delga 

Sistema Full Stack desenvolvido para o setor de Pintura da Grupo Delga, com o objetivo de substituir controles manuais realizados por planilhas e anotações por uma aplicação centralizada, permitindo o registro, acompanhamento e gerenciamento da produção.

A aplicação possui um Front-end desenvolvido em React e um Back-end desenvolvido em Java com Spring Boot, utilizando PostgreSQL para persistência dos dados e autenticação baseada em JWT.

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React + Vite">
  <img src="https://img.shields.io/badge/Backend-Java%20%2B%20Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Java Spring Boot">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Security-Spring%20Security%20%2B%20JWT-6DB33F?style=flat-square&logo=springsecurity&logoColor=white" alt="Spring Security JWT">
  <img src="https://img.shields.io/badge/Container-Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Deploy%20Front-Vercel-000000?style=flat-squaree&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/Deploy%20Back-Render-46E3B7?style=flat-square&logo=render&logoColor=white" alt="Render">
</p>

[**🔗 Acessar a aplicação**](https://pintura-po.vercel.app/)    operador / operador123      (aguarde a api acordar)

---

## 🚀 Funcionalidades

### 📋 Lançamentos

Permite registrar os lançamentos da produção, incluindo informações como:

- Peça
- Lote
- Quantidade
- Horário
- Turno
- Barras produzidas

O sistema realiza automaticamente cálculos relacionados à produção e ao turno correspondente.

### 🏭 Ordens de Produção

Permite controlar as Ordens de Produção, possibilitando:

- Cadastro de ordens
- Definição de quantidade planejada
- Acompanhamento da produção
- Controle de prioridade
- Relação entre produção realizada e quantidade planejada

### ⏸️ Paradas

Permite registrar as paradas ocorridas durante a produção, incluindo:

- Motivo da parada
- Horário de início
- Horário de término
- Duração

### 📦 Sobras

Módulo destinado ao controle de peças que permaneceram como sobra durante o processo produtivo.

### 🧩 Catálogo de Peças

Permite cadastrar e consultar peças utilizadas no processo de produção.

O cadastro possui informações como:

- Nome da peça
- Cliente
- Composição
- Informações de embalagem
- Foto da peça

### 👤 Usuários

O sistema possui autenticação e controle de acesso através de dois perfis:

**Administrador**
- Acesso completo ao sistema
- Gerenciamento de usuários
- Gerenciamento de Ordens de Produção
- Gerenciamento do catálogo de peças
- Acesso aos demais módulos

**Operador**
- Acesso aos recursos utilizados no processo produtivo
- Lançamentos
- Paradas
- Sobras

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura desacoplada, separando o Front-end da API Back-end.

```text
                    ┌───────────────────┐
                    │      Usuário      │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   React + Vite    │
                    │    Front-end      │
                    └─────────┬─────────┘
                              │
                         HTTP / REST
                              │
                              ▼
                    ┌───────────────────┐
                    │  Spring Boot API  │
                    │      Java 17      │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
          ┌─────────────────┐   ┌───────────────┐
          │   PostgreSQL    │   │ Spring        │
          │    Database     │   │ Security + JWT│
          └─────────────────┘   └───────────────┘
