package com.delga.pinturapo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "sobras")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sobra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String peca;

    @Column(length = 60)
    private String lote;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(length = 255)
    private String observacao;

    @Builder.Default
    @Column(nullable = false)
    private Instant data = Instant.now();
}
