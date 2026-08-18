# Back-End (em construção)

Aqui vai ficar a API em **Spring Boot** responsável por:

- Autenticação/autorização (JWT), com dois papéis: `ADMIN` e `OPERADOR`.
  - `ADMIN`: pode criar/editar/remover ordens de produção, peças do catálogo etc.
  - `OPERADOR`: acesso de leitura (visualização) aos dados do dia/turno.
- Persistir no banco de dados os lançamentos, sobras, paradas, catálogo de
  peças (com embalagem) e ordens de produção.
- Calcular o turno (`MANHA` / `TARDE` / `NOITE`) automaticamente a partir do
  horário de início de cada lançamento.
- Expor endpoints para o Front-End consumir (login, lançamentos, sobras,
  paradas, catálogo, ordens de produção) e, futuramente, para gerar a
  exportação mensal por turno.

## Como vai rodar (quando existir)

```bash
cd Back-End
./mvnw spring-boot:run
```

