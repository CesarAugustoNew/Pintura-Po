package com.delga.pinturapo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "ordens_producao")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrdemProducao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String peca;

    @Column(nullable = false, length = 60)
    private String lote;

    @Column(nullable = false)
    private Integer quantidade;

    private Integer quantidadeEmProcesso;

    @Builder.Default
    @Column(nullable = false)
    private boolean prioridade = false;

    @Column(length = 5)
    private String horarioSaida;

    @Column(nullable = false, length = 20)
    private String turno;

    @Builder.Default
    @Column(nullable = false)
    private Instant data = Instant.now();

    // Calculado on-the-fly a partir dos lançamentos (não persistido).
    @Transient
    private Integer quantidadeProduzida;
}
