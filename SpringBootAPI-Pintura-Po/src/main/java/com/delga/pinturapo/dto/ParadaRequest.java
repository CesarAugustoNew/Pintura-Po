package com.delga.pinturapo.dto;

public record ParadaRequest(
        String motivo,
        String horaInicio,
        String horaFim,
        String turnoAtivo
) {}
