package com.delga.pinturapo.service;

import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Replica a regra de turnos que existia em constants.js / utils/turnos.js
 * no front-end: 3 turnos, o 3º cruzando a meia-noite.
 */
@Service
public class TurnoService {

    public record Turno(String id, int numero, String label, int inicioMin, int fimMin) {}

    public static final int TOTAL_BARRAS = 49;

    public final List<Turno> turnos = List.of(
            new Turno("turno1", 1, "1º Turno", 6 * 60, 14 * 60),
            new Turno("turno2", 2, "2º Turno", 14 * 60, 22 * 60 + 30),
            new Turno("turno3", 3, "3º Turno", 22 * 60 + 30, 6 * 60)
    );

    /** Retorna o id do turno ("turno1"/"turno2"/"turno3") para um horário "HH:MM", ou null se vazio/inválido. */
    public String getTurnoPorHorario(String horario) {
        Integer minutos = paraMinutos(horario);
        if (minutos == null) return null;
        for (Turno t : turnos) {
            if (dentroDoTurno(minutos, t)) return t.id();
        }
        return null;
    }

    private Integer paraMinutos(String horario) {
        if (horario == null || horario.isBlank()) return null;
        String[] partes = horario.split(":");
        if (partes.length != 2) return null;
        try {
            int h = Integer.parseInt(partes[0].trim());
            int m = Integer.parseInt(partes[1].trim());
            return h * 60 + m;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private boolean dentroDoTurno(int minutos, Turno turno) {
        if (turno.inicioMin() < turno.fimMin()) {
            return minutos >= turno.inicioMin() && minutos < turno.fimMin();
        }
        return minutos >= turno.inicioMin() || minutos < turno.fimMin();
    }

    /**
     * Gera a sequência cíclica de números de barra entre inicial e final
     * (mesma regra de buildBarraSequence em utils/barras.js).
     */
    public List<Integer> buildBarraSequence(int barraInicial, int barraFinal) {
        if (barraInicial < 1 || barraInicial > TOTAL_BARRAS) return List.of();
        if (barraFinal < 1 || barraFinal > TOTAL_BARRAS) return List.of();

        List<Integer> seq = new java.util.ArrayList<>();
        int cur = barraInicial;
        for (int i = 0; i < TOTAL_BARRAS; i++) {
            seq.add(cur);
            if (cur == barraFinal) break;
            cur = (cur == TOTAL_BARRAS) ? 1 : cur + 1;
        }
        return seq;
    }
}
