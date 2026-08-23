package com.delga.pinturapo.dto;

import java.util.List;

public record PecaRequest(
        String codigo,
        String descricao,
        String cliente,
        String composicao,
        String caixa,
        Integer qtdPorCaixa,
        List<String> imagens
) {}
