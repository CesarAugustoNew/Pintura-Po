import { useMemo, useState } from "react";

/**
 * Centraliza o estado e as regras de negócio do catálogo de peças
 * usado como referência para novos funcionários.
 */
export function useCatalogoPecas() {
  const [pecas, setPecas] = useState([]);
  const [busca, setBusca] = useState("");

  function addPeca({ codigo, descricao, imagem, caixa, qtdPorCaixa }) {
    if (!codigo.trim()) return { ok: false, error: "Informe o número/código da peça." };
    if (!descricao.trim())
      return { ok: false, error: "Escreva uma descrição para ajudar quem for consultar." };

    const qtd = parseInt(qtdPorCaixa, 10);

    setPecas((prev) => [
      {
        id: Date.now(),
        codigo: codigo.trim().toUpperCase(),
        descricao: descricao.trim(),
        imagem: imagem || null,
        caixa: (caixa || "").trim(),
        qtdPorCaixa: !isNaN(qtd) && qtd > 0 ? qtd : null,
      },
      ...prev,
    ]);

    return { ok: true };
  }

  function removePeca(id) {
    setPecas((prev) => prev.filter((p) => p.id !== id));
  }

  const pecasFiltradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return pecas;
    return pecas.filter(
      (p) => p.codigo.toLowerCase().includes(q) || p.descricao.toLowerCase().includes(q)
    );
  }, [pecas, busca]);

  return { pecas, pecasFiltradas, busca, setBusca, addPeca, removePeca };
}
