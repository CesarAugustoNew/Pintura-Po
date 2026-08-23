package com.delga.pinturapo.repository;

import com.delga.pinturapo.entity.Lancamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LancamentoRepository extends JpaRepository<Lancamento, Long> {
    List<Lancamento> findAllByOrderByDataDesc();
}
