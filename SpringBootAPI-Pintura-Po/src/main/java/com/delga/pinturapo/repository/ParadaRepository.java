package com.delga.pinturapo.repository;

import com.delga.pinturapo.entity.Parada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParadaRepository extends JpaRepository<Parada, Long> {
    List<Parada> findAllByOrderByDataDesc();
}
