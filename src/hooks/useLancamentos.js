import { useEffect, useState } from "react";
import {
  listLancamentos,
  createLancamento,
  updateLancamento,
  removeLancamento,
} from "../api/lancamentos";

/**
 * Centraliza o estado dos lançamentos de barras, agora sincronizado com a
 * API (PostgreSQL). A validação e os cálculos (barras usadas, total de
 * peças, turno) são feitos no back-end; aqui só mapeamos a resposta da
 * API pro formato que os componentes já esperam.
 */
function mapApiToUi(item) {
  return { ...item, data: new Date(item.data) };
}

function toApiPayload(form) {
  const temUltimaParcial = form.qtdUltimaBarra !== "" && form.qtdUltimaBarra !== undefined;
  return {
    isSetup: !!form.isSetup,
    peca: form.peca || "",
    lote: form.lote || "",
    qtdPorBarra: form.qtdPorBarra !== "" ? Number(form.qtdPorBarra) : null,
    qtdUltimaBarra: temUltimaParcial ? Number(form.qtdUltimaBarra) : null,
    barraInicial: form.barraInicial !== "" ? Number(form.barraInicial) : null,
    barraFinal: form.barraFinal !== "" ? Number(form.barraFinal) : null,
    horaInicio: form.horaInicio || "",
  };
}

export function useLancamentos(turnoAtivo) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");

  async function carregar() {
    setLoading(true);
    try {
      const data = await listLancamentos();
      setEntries(data.map(mapApiToUi));
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

  async function addEntry(form) {
    try {
      const created = await createLancamento({ ...toApiPayload(form), turnoAtivo });
      setEntries((prev) => [mapApiToUi(created), ...prev]);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function updateEntry(id, form) {
    try {
      const updated = await updateLancamento(id, { ...toApiPayload(form), turnoAtivo });
      setEntries((prev) => prev.map((e) => (e.id === id ? mapApiToUi(updated) : e)));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function removeEntry(id) {
    try {
      await removeLancamento(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  return { entries, addEntry, updateEntry, removeEntry, loading, erroCarregamento, recarregar: carregar };
}
