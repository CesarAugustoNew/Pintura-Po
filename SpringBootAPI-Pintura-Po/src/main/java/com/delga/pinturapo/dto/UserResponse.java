package com.delga.pinturapo.dto;

import com.delga.pinturapo.entity.Role;
import com.delga.pinturapo.entity.User;

public record UserResponse(Long id, String username, String nome, Role role, boolean ativo) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getNome(), user.getRole(), user.isAtivo());
    }
}
