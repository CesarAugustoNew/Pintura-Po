package com.delga.pinturapo.dto;

public record LoginResponse(
        String token,
        String username,
        String nome,
        String role
) {}
