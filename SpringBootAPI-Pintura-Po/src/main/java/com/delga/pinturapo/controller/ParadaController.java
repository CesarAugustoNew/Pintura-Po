package com.delga.pinturapo.controller;

import com.delga.pinturapo.dto.ParadaRequest;
import com.delga.pinturapo.entity.Parada;
import com.delga.pinturapo.service.ParadaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paradas")
@RequiredArgsConstructor
public class ParadaController {

    private final ParadaService service;

    @GetMapping
    public List<Parada> findAll() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Parada create(@RequestBody ParadaRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public Parada update(@PathVariable Long id, @RequestBody ParadaRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
