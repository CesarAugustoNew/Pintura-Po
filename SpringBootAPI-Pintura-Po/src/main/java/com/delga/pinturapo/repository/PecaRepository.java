package com.delga.pinturapo.repository;

import com.delga.pinturapo.entity.Peca;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PecaRepository extends JpaRepository<Peca, Long> {
    boolean existsByCodigo(String codigo);
}
