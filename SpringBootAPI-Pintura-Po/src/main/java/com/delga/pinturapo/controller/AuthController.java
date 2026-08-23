package com.delga.pinturapo.controller;

import com.delga.pinturapo.dto.LoginRequest;
import com.delga.pinturapo.dto.LoginResponse;
import com.delga.pinturapo.entity.User;
import com.delga.pinturapo.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtService.generateToken(user, Map.of("role", user.getRole().name(), "nome", user.getNome()));

        return new LoginResponse(token, user.getUsername(), user.getNome(), user.getRole().name());
    }
}
