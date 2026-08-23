package com.delga.pinturapo.dto;

import com.delga.pinturapo.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotBlank(message = "Informe o usuário.") String username,
        @NotBlank @Size(min = 6, message = "A senha deve ter ao menos 6 caracteres.") String password,
        @NotBlank(message = "Informe o nome.") String nome,
        @NotNull(message = "Informe o papel (ADMIN ou OPERADOR).") Role role
) {}
