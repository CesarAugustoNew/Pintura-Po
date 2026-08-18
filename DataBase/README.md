# Banco de dados (em construção)

Banco: **PostgreSQL**.

## Tabelas principais (rascunho inicial)

- `usuarios` — id, nome, email, senha (hash), role (`ADMIN` / `OPERADOR`)
- `pecas` — id, codigo, descricao, imagem, caixa, qtd_por_caixa
- `lancamentos` — id, peca_id, lote, hora_inicio, data_hora, turno, qtd_por_barra, barra_inicial, barra_final, qtd_ultima_barra, usuario_id
- `sobras` — id, peca_id, ..., data_hora, turno, usuario_id
- `paradas` — id, motivo, hora_inicio, hora_fim, duracao_minutos, data, turno, usuario_id
- `ordens_producao` — id, peca_id, quantidade, status, criado_por (usuario_id)
