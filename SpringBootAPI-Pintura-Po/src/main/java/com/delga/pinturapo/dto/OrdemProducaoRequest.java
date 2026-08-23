package com.delga.pinturapo.dto;

public record OrdemProducaoRequest(
        String peca,
        String lote,
        Integer quantidade,
        Integer quantidadeEmProcesso,
        Boolean prioridade,
        String horarioSaida,
        String turnoAtivo
) {}
