package com.delga.pinturapo.service;

import com.delga.pinturapo.dto.OrdemProducaoRequest;
import com.delga.pinturapo.entity.Lancamento;
import com.delga.pinturapo.entity.OrdemProducao;
import com.delga.pinturapo.exception.BusinessException;
import com.delga.pinturapo.repository.LancamentoRepository;
import com.delga.pinturapo.repository.OrdemProducaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Replica useOrdensProducao.js: a quantidade produzida de cada ordem é
 * abatida automaticamente somando os lançamentos (não-setup) da mesma
 * peça + mesmo turno, e a lista final fica ordenada com prioridades no
 * topo e, dentro do grupo, por horário de saída.
 */
@Service
@RequiredArgsConstructor
public class OrdemProducaoService {

    private final OrdemProducaoRepository repository;
    private final LancamentoRepository lancamentoRepository;
    private final TurnoService turnoService;

    public List<OrdemProducao> findAll() {
        List<OrdemProducao> ordens = repository.findAllByOrderByDataDesc();
        Map<String, Integer> produzidoPorTurnoPeca = calcularProduzido();

        ordens.forEach(o -> o.setQuantidadeProduzida(
                produzidoPorTurnoPeca.getOrDefault(o.getTurno() + "::" + o.getPeca(), 0)
        ));

        return ordens.stream()
                .sorted(Comparator
                        .comparing((OrdemProducao o) -> !o.isPrioridade()) // prioridade=true primeiro
                        .thenComparing(o -> o.getHorarioSaida() == null || o.getHorarioSaida().isBlank(),
                                Comparator.naturalOrder()) // quem tem horário vem antes de quem não tem
                        .thenComparing(o -> o.getHorarioSaida() == null ? "" : o.getHorarioSaida()))
                .toList();
    }

    private Map<String, Integer> calcularProduzido() {
        Map<String, Integer> map = new HashMap<>();
        for (Lancamento l : lancamentoRepository.findAll()) {
            if (l.isSetup()) continue;
            String chave = l.getTurno() + "::" + l.getPeca();
            map.merge(chave, l.getTotalPecas(), Integer::sum);
        }
        return map;
    }

    @Transactional
    public OrdemProducao create(OrdemProducaoRequest request) {
        return repository.save(build(null, request));
    }

    @Transactional
    public OrdemProducao update(Long id, OrdemProducaoRequest request) {
        if (!repository.existsById(id)) {
            throw new BusinessException("Ordem de produção não encontrada.");
        }
        return repository.save(build(id, request));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new BusinessException("Ordem de produção não encontrada.");
        }
        repository.deleteById(id);
    }

    private OrdemProducao build(Long id, OrdemProducaoRequest req) {
        String peca = req.peca() == null ? "" : req.peca().trim();
        String lote = req.lote() == null ? "" : req.lote().trim();

        if (peca.isEmpty()) throw new BusinessException("Informe o número/modelo da peça.");
        if (lote.isEmpty()) throw new BusinessException("Informe o lote.");
        if (req.quantidade() == null || req.quantidade() <= 0) {
            throw new BusinessException("Informe a quantidade a enviar.");
        }
        if (req.quantidadeEmProcesso() != null && req.quantidadeEmProcesso() < 0) {
            throw new BusinessException("Qtde em processo inválida.");
        }

        String horarioSaida = req.horarioSaida() == null ? "" : req.horarioSaida();
        String turno = turnoService.getTurnoPorHorario(horarioSaida);

        return OrdemProducao.builder()
                .id(id)
                .peca(peca.toUpperCase())
                .lote(lote.toUpperCase())
                .quantidade(req.quantidade())
                .quantidadeEmProcesso(req.quantidadeEmProcesso())
                .prioridade(Boolean.TRUE.equals(req.prioridade()))
                .horarioSaida(horarioSaida)
                .turno(turno != null ? turno : fallbackTurno(req.turnoAtivo()))
                .build();
    }

    private String fallbackTurno(String turnoAtivo) {
        return turnoAtivo != null && !turnoAtivo.isBlank() ? turnoAtivo : "turno1";
    }
}
