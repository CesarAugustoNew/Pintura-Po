package com.delga.pinturapo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pecas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Peca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String codigo;

    @Column(length = 255)
    private String descricao;

    @Column(length = 120)
    private String cliente;

    @Column(length = 255)
    private String composicao;

    @Column(length = 60)
    private String caixa;

    private Integer qtdPorCaixa;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "peca_imagens", joinColumns = @JoinColumn(name = "peca_id"))
    @Column(name = "url", length = 500)
    private List<String> imagens = new ArrayList<>();
}
