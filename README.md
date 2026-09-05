# Grupo Delga — Controle de Barras e Embalagem

Sistema desenvolvido para o setor de Pintura, criado para substituir o controle manual (planilhas e anotações soltas) por um sistema único, acessado por qualquer computador, com os dados sempre atualizados e compartilhados entre todos que usam o sistema.

O projeto é dividido em duas partes que trabalham juntas: uma tela (front-end), que é o que a pessoa vê e usa no dia a dia, e um sistema por trás (back-end), responsável por guardar e organizar todas as informações com segurança.

## O que o sistema faz

- **Lançamentos**: registro de cada barra de pintura, com peça, lote, quantidade e horário, já calculando automaticamente quantas peças foram produzidas e em qual turno.
- **Ordens de Produção**: o que precisa ser produzido no dia, com prioridades e acompanhamento de quanto já foi entregue.
- **Paradas**: registro de paradas de produção, com motivo, horário e duração.
- **Sobras**: controle de peças que sobraram no processo.
- **Catálogo de Peças**: cadastro com foto, cliente, composição e informações de embalagem de cada peça.
- **Login com dois tipos de usuário**: um perfil de **Administrador**, com acesso completo, e um perfil de **Operador**, com acesso ao uso diário (lançamentos, paradas e sobras), mas sem poder alterar ordens de produção ou o catálogo — essas duas áreas ficam restritas ao administrador.

## Front-end (a tela que o usuário usa)

Construído em React, é a parte visual do sistema: as abas, os formulários, as tabelas e os gráficos que aparecem na tela. Sempre que alguém adiciona, edita ou remove uma informação, o front-end conversa com o back-end para salvar isso de forma permanente — nada fica só "na tela", tudo é gravado de verdade.

## Back-end (a API)

Construído em Java com Spring Boot, é a parte responsável por:

- Validar as informações antes de salvar (por exemplo, impedir que um lançamento seja salvo sem peça ou sem lote).
- Calcular automaticamente informações como turno, total de peças produzidas e duração de paradas.
- Controlar o login e garantir que cada usuário só acesse o que tem permissão para acessar.
- Guardar tudo de forma organizada no banco de dados.

## Como o banco de dados foi organizado

O banco guarda as informações em grupos, cada um representando uma parte do sistema:

- **Usuários** — quem pode entrar no sistema, e com qual nível de acesso (administrador ou operador).
- **Peças** — o catálogo de peças cadastradas, com suas informações e fotos.
- **Lançamentos** — cada registro de barra lançada, incluindo qual peça, lote, horário e turno.
- **Ordens de Produção** — o que precisa ser produzido, com meta e prioridade.
- **Paradas** — os registros de parada, com motivo e duração.
- **Sobras** — o controle de sobras de peças.

Esses grupos se conectam entre si por meio da peça e do turno: por exemplo, o sistema usa os lançamentos de uma peça para calcular automaticamente quanto já foi produzido daquela mesma peça na Ordem de Produção correspondente — sem precisar de nenhum cálculo manual.

## Deploy (onde o sistema está publicado)

- O **front-end** está publicado na **Vercel**, plataforma especializada em publicar sites e aplicações web de forma rápida.
- O **back-end** e o **banco de dados** estão publicados no **Render**, plataforma que hospeda tanto a API quanto o banco de dados PostgreSQL usado para guardar as informações.

As duas partes ficam publicadas em endereços próprios na internet e se comunicam entre si automaticamente, então o sistema funciona de qualquer computador com acesso à internet, sem precisar instalar nada.
