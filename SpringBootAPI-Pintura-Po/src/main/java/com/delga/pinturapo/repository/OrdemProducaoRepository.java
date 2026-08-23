package com.delga.pinturapo.repository;

import com.delga.pinturapo.entity.OrdemProducao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdemProducaoRepository extends JpaRepository<OrdemProducao, Long> {
    List<OrdemProducao> findAllByOrderByDataDesc();
}
