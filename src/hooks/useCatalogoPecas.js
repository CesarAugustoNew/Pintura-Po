import { useEffect, useMemo, useState } from "react";
import { listPecas, createPeca, removePeca } from "../api/pecas";

/**
 * Centraliza o estado do catálogo de peças, sincronizado com a API.
 */
function toApiPayload(form) {
  const qtd = parseInt(form.qtdPorCaixa, 10);
  return {
    codigo: form.codigo || "",
    descricao: form.descricao || "",
    cliente: form.cliente || "",
    composicao: form.composicao || "",
    caixa: form.caixa || "",
    qtdPorCaixa: !isNaN(qtd) && qtd > 0 ? qtd : null,
    imagens: Array.isArray(form.imagens) ? form.imagens.filter(Boolean) : [],
  };
}

export function useCatalogoPecas() {
  const [pecas, setPecas] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");

  async function carregar() {
    setLoading(true);
    try {
      const data = await listPecas();
      setPecas(data);
      setErroCarregamento("");
    } catch (e) {
      setErroCarregamento(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addPeca(form) {
    try {
      const created = await createPeca(toApiPayload(form));
      setPecas((prev) => [created, ...prev]);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function removePecaFn(id) {
    try {
      await removePeca(id);
      setPecas((prev) => prev.filter((p) => p.id !== id));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  const pecasFiltradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return pecas;
    return pecas.filter(
      (p) =>
        p.codigo.toLowerCase().includes(q) ||
        (p.descricao || "").toLowerCase().includes(q) ||
        (p.cliente || "").toLowerCase().includes(q) ||
        (p.composicao || "").toLowerCase().includes(q)
    );
  }, [pecas, busca]);

  return {
    pecas,
    pecasFiltradas,
    busca,
    setBusca,
    addPeca,
    removePeca: removePecaFn,
    loading,
    erroCarregamento,
  };
}
