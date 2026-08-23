package com.delga.pinturapo.service;

import com.delga.pinturapo.dto.PecaRequest;
import com.delga.pinturapo.entity.Peca;
import com.delga.pinturapo.exception.BusinessException;
import com.delga.pinturapo.repository.PecaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PecaService {

    private final PecaRepository repository;

    public List<Peca> findAll(String busca) {
        List<Peca> all = repository.findAll();
        if (busca == null || busca.isBlank()) return all;

        String q = busca.trim().toLowerCase();
        return all.stream()
                .filter(p -> contains(p.getCodigo(), q)
                        || contains(p.getDescricao(), q)
                        || contains(p.getCliente(), q)
                        || contains(p.getComposicao(), q))
                .toList();
    }

    private boolean contains(String value, String q) {
        return value != null && value.toLowerCase().contains(q);
    }

    @Transactional
    public Peca create(PecaRequest request) {
        String codigo = request.codigo() == null ? "" : request.codigo().trim();
        if (codigo.isEmpty()) throw new BusinessException("Informe o número/código da peça.");

        Integer qtd = request.qtdPorCaixa();

        Peca peca = Peca.builder()
                .codigo(codigo.toUpperCase())
                .descricao(request.descricao() == null ? "" : request.descricao().trim())
                .cliente(request.cliente() == null ? "" : request.cliente().trim())
                .composicao(request.composicao() == null ? "" : request.composicao().trim())
                .caixa(request.caixa() == null ? "" : request.caixa().trim())
                .qtdPorCaixa(qtd != null && qtd > 0 ? qtd : null)
                .imagens(request.imagens() == null ? new ArrayList<>() : new ArrayList<>(request.imagens()))
                .build();

        return repository.save(peca);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new BusinessException("Peça não encontrada.");
        }
        repository.deleteById(id);
    }
}
