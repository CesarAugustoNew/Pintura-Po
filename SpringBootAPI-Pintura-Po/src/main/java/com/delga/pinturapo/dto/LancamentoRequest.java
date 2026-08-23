package com.delga.pinturapo.dto;

import jakarta.validation.constraints.NotNull;

public record LancamentoRequest(
        Boolean isSetup,
        String peca,
        String lote,
        Integer qtdPorBarra,
        Integer qtdUltimaBarra,
        @NotNull(message = "Informe a barra inicial.") Integer barraInicial,
        @NotNull(message = "Informe a barra final.") Integer barraFinal,
        String horaInicio,
        String turnoAtivo // usado como fallback quando horaInicio vier vazio
) {}
