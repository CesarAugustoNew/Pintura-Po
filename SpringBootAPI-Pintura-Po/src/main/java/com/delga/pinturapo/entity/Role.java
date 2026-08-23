package com.delga.pinturapo.entity;

/**
 * Papéis de usuário do sistema.
 *
 * ADMIN     - acesso total: gerencia usuários, catálogo de peças e todos os
 *             registros (lançamentos, ordens, paradas, sobras).
 * OPERADOR  - uso diário do chão de fábrica: cria/edita/remove lançamentos,
 *             ordens, paradas e sobras, mas não gerencia usuários.
 */
public enum Role {
    ADMIN,
    OPERADOR
}
