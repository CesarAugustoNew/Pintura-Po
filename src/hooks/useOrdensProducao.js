import { useEffect, useState } from "react";
import { listOrdens, createOrdem, updateOrdem, removeOrdem } from "../api/ordens";

/**
 * Centraliza o estado da ordem de produção do dia, sincronizado com a API.
 * A quantidade já produzida (abatida automaticamente pelos lançamentos da
 * mesma peça + mesmo turno) e a ordenação (prioridades no topo, depois por
 * horário de saída) já vêm prontas do back-end — aqui só recarregamos a
 * lista sempre que os lançamentos mudam, pra manter o "produzido" em dia.
 */
function mapApiToUi(item) {
  return { ...item, data: new Date(item.data) };
}

function toApiPayload(form) {
  const temQtdProcesso =
    form.quantidadeEmProcesso !== "" &&
    form.quantidadeEmProcesso !== undefined &&
    form.quantidadeEmProcesso !== null;

  return {
    peca: form.peca || "",
    lote: form.lote || "",
    quantidade: form.quantidade !== "" ? Number(form.quantidade) : null,
    quantidadeEmProcesso: temQtdProcesso ? Number(form.quantidadeEmProcesso) : null,
    prioridade: !!form.prioridade,
    horarioSaida: form.horarioSaida || "",
  };
}

export function useOrdensProducao(lancamentos = [], turnoAtivo) {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");

  async function carregar() {
    setLoading(true);
    try {
      const data = await listOrdens();
      setOrdens(data.map(mapApiToUi));
      setErroCarregamento("");
    } catch (e) {
      setErroCarregamento(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Recarrega sempre que os lançamentos mudam (novo lançamento pode abater
  // a quantidade produzida de alguma ordem), além de uma vez ao montar.
  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lancamentos]);

  async function addOrdem(form) {
    try {
      const created = await createOrdem({ ...toApiPayload(form), turnoAtivo });
      await carregar();
      return { ok: true, created };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function updateOrdemFn(id, form) {
    try {
      await updateOrdem(id, { ...toApiPayload(form), turnoAtivo });
      await carregar();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function removeOrdemFn(id) {
    try {
      await removeOrdem(id);
      setOrdens((prev) => prev.filter((o) => o.id !== id));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  return {
    ordens,
    addOrdem,
    updateOrdem: updateOrdemFn,
    removeOrdem: removeOrdemFn,
    loading,
    erroCarregamento,
  };
}
