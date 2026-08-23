package com.delga.pinturapo.service;

import com.delga.pinturapo.dto.ParadaRequest;
import com.delga.pinturapo.entity.Parada;
import com.delga.pinturapo.exception.BusinessException;
import com.delga.pinturapo.repository.ParadaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParadaService {

    private final ParadaRepository repository;
    private final TurnoService turnoService;

    public List<Parada> findAll() {
        return repository.findAllByOrderByDataDesc();
    }

    @Transactional
    public Parada create(ParadaRequest request) {
        return repository.save(build(null, request));
    }

    @Transactional
    public Parada update(Long id, ParadaRequest request) {
        if (!repository.existsById(id)) {
            throw new BusinessException("Parada não encontrada.");
        }
        return repository.save(build(id, request));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new BusinessException("Parada não encontrada.");
        }
        repository.deleteById(id);
    }

    private Parada build(Long id, ParadaRequest req) {
        String motivo = req.motivo() == null ? "" : req.motivo().trim();
        if (motivo.isEmpty()) throw new BusinessException("Informe o motivo da parada.");
        if (req.horaInicio() == null || req.horaInicio().isBlank()) {
            throw new BusinessException("Informe o horário de início da parada.");
        }
        if (req.horaFim() == null || req.horaFim().isBlank()) {
            throw new BusinessException("Informe o horário de fim da parada.");
        }

        Integer duracao = calcularDuracaoMinutos(req.horaInicio(), req.horaFim());
        if (duracao == null || duracao <= 0) {
            throw new BusinessException("Confira os horários: o fim deve ser depois do início.");
        }

        String turno = turnoService.getTurnoPorHorario(req.horaInicio());

        return Parada.builder()
                .id(id)
                .motivo(motivo)
                .horaInicio(req.horaInicio())
                .horaFim(req.horaFim())
                .duracaoMinutos(duracao)
                .turno(turno != null ? turno : fallbackTurno(req.turnoAtivo()))
                .build();
    }

    /** Réplica de calcularDuracaoMinutos em utils/paradas.js (trata virada de meia-noite). */
    private Integer calcularDuracaoMinutos(String horaInicio, String horaFim) {
        Integer inicio = paraMinutos(horaInicio);
        Integer fim = paraMinutos(horaFim);
        if (inicio == null || fim == null) return null;
        if (fim < inicio) fim += 24 * 60;
        return fim - inicio;
    }

    private Integer paraMinutos(String horario) {
        try {
            String[] partes = horario.split(":");
            return Integer.parseInt(partes[0].trim()) * 60 + Integer.parseInt(partes[1].trim());
        } catch (Exception e) {
            return null;
        }
    }

    private String fallbackTurno(String turnoAtivo) {
        return turnoAtivo != null && !turnoAtivo.isBlank() ? turnoAtivo : "turno1";
    }
}
