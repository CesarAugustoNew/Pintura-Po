package com.delga.pinturapo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "paradas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Parada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String motivo;

    @Column(nullable = false, length = 5)
    private String horaInicio;

    @Column(nullable = false, length = 5)
    private String horaFim;

    @Column(nullable = false)
    private Integer duracaoMinutos;

    @Column(nullable = false, length = 20)
    private String turno;

    @Builder.Default
    @Column(nullable = false)
    private Instant data = Instant.now();
}
