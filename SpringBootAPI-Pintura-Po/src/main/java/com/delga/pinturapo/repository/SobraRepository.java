package com.delga.pinturapo.repository;

import com.delga.pinturapo.entity.Sobra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SobraRepository extends JpaRepository<Sobra, Long> {
    List<Sobra> findAllByOrderByDataDesc();
}
