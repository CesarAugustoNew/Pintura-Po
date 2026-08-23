package com.delga.pinturapo.controller;

import com.delga.pinturapo.dto.CreateUserRequest;
import com.delga.pinturapo.dto.UserResponse;
import com.delga.pinturapo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Gestão de usuários do sistema. Restrito ao papel ADMIN
 * (a regra também está reforçada em SecurityConfig, em /api/users/**).
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponse> findAll() {
        return userService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody CreateUserRequest request) {
        return userService.create(request);
    }

    @PatchMapping("/{id}/ativo")
    public void setAtivo(@PathVariable Long id, @RequestParam boolean ativo) {
        userService.setAtivo(id, ativo);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
