package com.delga.pinturapo.dto;

public record SobraRequest(
        String peca,
        String lote,
        Integer quantidade,
        String observacao
) {}
