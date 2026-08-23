package com.delga.pinturapo.controller;

import com.delga.pinturapo.dto.SobraRequest;
import com.delga.pinturapo.entity.Sobra;
import com.delga.pinturapo.service.SobraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sobras")
@RequiredArgsConstructor
public class SobraController {

    private final SobraService service;

    @GetMapping
    public List<Sobra> findAll() {
        return service.findAll();
    }

    @GetMapping("/total")
    public Map<String, Integer> total() {
        return Map.of("totalSobras", service.totalSobras());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Sobra create(@RequestBody SobraRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public Sobra update(@PathVariable Long id, @RequestBody SobraRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
