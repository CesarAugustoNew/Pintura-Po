package com.delga.pinturapo.service;

import com.delga.pinturapo.dto.LancamentoRequest;
import com.delga.pinturapo.entity.Lancamento;
import com.delga.pinturapo.exception.BusinessException;
import com.delga.pinturapo.repository.LancamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Replica a regra de validarECalcularLancamento.js: valida os campos e
 * calcula barrasUsadas / totalPecas / turno a partir dos dados brutos.
 */
@Service
@RequiredArgsConstructor
public class LancamentoService {

    private final LancamentoRepository repository;
    private final TurnoService turnoService;

    public List<Lancamento> findAll() {
        return repository.findAllByOrderByDataDesc();
    }

    @Transactional
    public Lancamento create(LancamentoRequest request) {
        return repository.save(build(null, request));
    }

    @Transactional
    public Lancamento update(Long id, LancamentoRequest request) {
        if (!repository.existsById(id)) {
            throw new BusinessException("Lançamento não encontrado.");
        }
        return repository.save(build(id, request));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new BusinessException("Lançamento não encontrado.");
        }
        repository.deleteById(id);
    }

    private Lancamento build(Long id, LancamentoRequest req) {
        Integer bi = req.barraInicial();
        Integer bf = req.barraFinal();

        if (bi == null || bf == null) {
            throw new BusinessException("Informe a barra inicial e final.");
        }
        if (bi < 1 || bi > TurnoService.TOTAL_BARRAS || bf < 1 || bf > TurnoService.TOTAL_BARRAS) {
            throw new BusinessException("A numeração da barra deve ser de 1 a " + TurnoService.TOTAL_BARRAS + ".");
        }

        List<Integer> sequence = turnoService.buildBarraSequence(bi, bf);
        int barrasUsadas = sequence.size();
        String horaInicio = req.horaInicio() == null ? "" : req.horaInicio().trim();
        String turno = turnoService.getTurnoPorHorario(horaInicio);
        boolean isSetup = Boolean.TRUE.equals(req.isSetup());

        if (isSetup) {
            return Lancamento.builder()
                    .id(id)
                    .isSetup(true)
                    .peca("SETUP")
                    .lote("")
                    .qtdPorBarra(0)
                    .qtdUltimaBarra(null)
                    .barraInicial(bi)
                    .barraFinal(bf)
                    .barrasUsadas(barrasUsadas)
                    .totalPecas(0)
                    .horaInicio(horaInicio)
                    .turno(turno != null ? turno : fallbackTurno(req.turnoAtivo()))
                    .build();
        }

        String peca = req.peca() == null ? "" : req.peca().trim();
        String lote = req.lote() == null ? "" : req.lote().trim();
        Integer qtd = req.qtdPorBarra();
        Integer qtdUltima = req.qtdUltimaBarra();
        boolean temUltimaParcial = qtdUltima != null;

        if (peca.isEmpty()) throw new BusinessException("Informe o número/modelo da peça.");
        if (lote.isEmpty()) throw new BusinessException("Informe o lote.");
        if (qtd == null || qtd < 1) throw new BusinessException("Informe a quantidade por barra.");
        if (temUltimaParcial && (qtdUltima < 0 || qtdUltima > qtd)) {
            throw new BusinessException("A quantidade na última barra deve ser de 0 até a quantidade por barra.");
        }

        int totalPecas = temUltimaParcial
                ? qtd * (barrasUsadas - 1) + qtdUltima
                : qtd * barrasUsadas;

        return Lancamento.builder()
                .id(id)
                .isSetup(false)
                .peca(peca.toUpperCase())
                .lote(lote.toUpperCase())
                .qtdPorBarra(qtd)
                .qtdUltimaBarra(temUltimaParcial ? qtdUltima : null)
                .barraInicial(bi)
                .barraFinal(bf)
                .barrasUsadas(barrasUsadas)
                .totalPecas(totalPecas)
                .horaInicio(horaInicio)
                .turno(turno != null ? turno : fallbackTurno(req.turnoAtivo()))
                .build();
    }

    private String fallbackTurno(String turnoAtivo) {
        return turnoAtivo != null && !turnoAtivo.isBlank() ? turnoAtivo : "turno1";
    }
}
