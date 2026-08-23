package com.delga.pinturapo.controller;

import com.delga.pinturapo.dto.OrdemProducaoRequest;
import com.delga.pinturapo.entity.OrdemProducao;
import com.delga.pinturapo.service.OrdemProducaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public OrdemProducao create(@RequestBody OrdemProducaoRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public OrdemProducao update(@PathVariable Long id, @RequestBody OrdemProducaoRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
