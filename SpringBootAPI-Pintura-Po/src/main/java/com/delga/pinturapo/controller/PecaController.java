package com.delga.pinturapo.controller;

import com.delga.pinturapo.dto.PecaRequest;
import com.delga.pinturapo.entity.Peca;
import com.delga.pinturapo.service.PecaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Qualquer usuário autenticado pode consultar (GET) o catálogo. Cadastrar
 * e remover peças é restrito ao ADMIN — o OPERADOR só consulta.
 */
@RestController
@RequestMapping("/api/pecas")
@RequiredArgsConstructor
public class PecaController {

    private final PecaService service;

    @GetMapping
    public List<Peca> findAll(@RequestParam(required = false) String busca) {
        return service.findAll(busca);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public Peca create(@RequestBody PecaRequest request) {
        return service.create(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
