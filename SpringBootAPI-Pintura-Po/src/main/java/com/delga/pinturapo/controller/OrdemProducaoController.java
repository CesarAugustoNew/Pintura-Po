package com.delga.pinturapo.controller;

import com.delga.pinturapo.dto.OrdemProducaoRequest;
import com.delga.pinturapo.entity.OrdemProducao;
import com.delga.pinturapo.service.OrdemProducaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Qualquer usuário autenticado pode consultar (GET) as ordens de produção.
 * Criar, editar e remover é restrito ao ADMIN — o OPERADOR só acompanha.
 */
@RestController
@RequestMapping("/api/ordens")
@RequiredArgsConstructor
public class OrdemProducaoController {

    private final OrdemProducaoService service;

    @GetMapping
    public List<OrdemProducao> findAll() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public OrdemProducao create(@RequestBody OrdemProducaoRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public OrdemProducao update(@PathVariable Long id, @RequestBody OrdemProducaoRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
