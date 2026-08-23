package com.delga.pinturapo.service;

import com.delga.pinturapo.dto.SobraRequest;
import com.delga.pinturapo.entity.Sobra;
import com.delga.pinturapo.exception.BusinessException;
import com.delga.pinturapo.repository.SobraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SobraService {

    private final SobraRepository repository;

    public List<Sobra> findAll() {
        return repository.findAllByOrderByDataDesc();
    }

    public int totalSobras() {
        return repository.findAll().stream().mapToInt(Sobra::getQuantidade).sum();
    }

    @Transactional
    public Sobra create(SobraRequest request) {
        return repository.save(build(null, request));
    }

    @Transactional
    public Sobra update(Long id, SobraRequest request) {
        if (!repository.existsById(id)) {
            throw new BusinessException("Sobra não encontrada.");
        }
        return repository.save(build(id, request));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new BusinessException("Sobra não encontrada.");
        }
        repository.deleteById(id);
    }

    private Sobra build(Long id, SobraRequest req) {
        String peca = req.peca() == null ? "" : req.peca().trim();
        if (peca.isEmpty()) throw new BusinessException("Informe o número/modelo da peça.");
        if (req.quantidade() == null || req.quantidade() < 1) {
            throw new BusinessException("Informe a quantidade de sobra.");
        }

        return Sobra.builder()
                .id(id)
                .peca(peca.toUpperCase())
                .lote(req.lote() == null ? "" : req.lote().trim().toUpperCase())
                .quantidade(req.quantidade())
                .observacao(req.observacao() == null ? "" : req.observacao().trim())
                .build();
    }
}
