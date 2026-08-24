import { useEffect, useMemo, useState } from "react";
import { listSobras, createSobra, updateSobra, removeSobra } from "../api/sobras";

/**
 * Centraliza o estado das sobras, sincronizado com a API.
 */
function mapApiToUi(item) {
  return { ...item, data: new Date(item.data) };
}

function toApiPayload(form) {
  return {
    peca: form.peca || "",
    lote: form.lote || "",
    quantidade: form.quantidade !== "" ? Number(form.quantidade) : null,
    observacao: form.observacao || "",
  };
}

export function useSobras() {
  const [sobras, setSobras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");

  async function carregar() {
    setLoading(true);
    try {
      const data = await listSobras();
      setSobras(data.map(mapApiToUi));
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

  async function addSobra(form) {
    try {
      const created = await createSobra(toApiPayload(form));
      setSobras((prev) => [mapApiToUi(created), ...prev]);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function updateSobraFn(id, form) {
    try {
      const updated = await updateSobra(id, toApiPayload(form));
      setSobras((prev) => prev.map((s) => (s.id === id ? mapApiToUi(updated) : s)));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function removeSobraFn(id) {
    try {
      await removeSobra(id);
      setSobras((prev) => prev.filter((s) => s.id !== id));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  const totalSobras = useMemo(() => sobras.reduce((s, e) => s + e.quantidade, 0), [sobras]);

  return {
    sobras,
    addSobra,
    updateSobra: updateSobraFn,
    removeSobra: removeSobraFn,
    totalSobras,
    loading,
    erroCarregamento,
  };
}
