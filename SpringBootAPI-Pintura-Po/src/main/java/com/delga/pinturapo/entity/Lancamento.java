package com.delga.pinturapo.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Um lançamento de barras de pintura. Os campos calculados (barrasUsadas,
 * totalPecas, turno) são derivados no service a partir dos campos brutos,
 * replicando a regra que antes vivia em validarLancamento.js no front-end.
 */
@Entity
@Table(name = "lancamentos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lancamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Sem o @JsonProperty explícito, o Lombok gera o getter isSetup() e o
    // Jackson (que só olha pro nome do getter) tira o prefixo "is" na hora
    // de serializar, virando "setup" no JSON — só que o front-end espera
    // exatamente "isSetup". Esta anotação fixa o nome do campo no JSON.
    @Builder.Default
    @Column(nullable = false)
    @JsonProperty("isSetup")
    private boolean isSetup = false;

    @Column(nullable = false, length = 60)
    private String peca;

    @Column(length = 60)
    private String lote;

    private Integer qtdPorBarra;

    private Integer qtdUltimaBarra;

    @Column(nullable = false)
    private Integer barraInicial;

    @Column(nullable = false)
    private Integer barraFinal;

    @Column(nullable = false)
    private Integer barrasUsadas;

    @Column(nullable = false)
    private Integer totalPecas;

    @Column(length = 5)
    private String horaInicio;

    @Column(nullable = false, length = 20)
    private String turno;

    @Builder.Default
    @Column(nullable = false)
    private Instant data = Instant.now();
}
