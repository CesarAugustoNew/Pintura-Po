package com.delga.pinturapo.controller;

import com.delga.pinturapo.dto.LancamentoRequest;
import com.delga.pinturapo.entity.Lancamento;
import com.delga.pinturapo.service.LancamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lancamentos")
@RequiredArgsConstructor
public class LancamentoController {

    private final LancamentoService service;

    @GetMapping
    public List<Lancamento> findAll() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Lancamento create(@RequestBody LancamentoRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public Lancamento update(@PathVariable Long id, @RequestBody LancamentoRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
