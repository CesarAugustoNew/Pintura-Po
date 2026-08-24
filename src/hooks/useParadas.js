import { useEffect, useState } from "react";
import { listParadas, createParada, updateParada, removeParada } from "../api/paradas";

/**
 * Centraliza o estado das paradas de produção, sincronizado com a API.
 * A duração e o turno são calculados no back-end a partir dos horários.
 */
function mapApiToUi(item) {
  return { ...item, data: new Date(item.data) };
}

function toApiPayload(form) {
  return {
    motivo: form.motivo || "",
    horaInicio: form.horaInicio || "",
    horaFim: form.horaFim || "",
  };
}

export function useParadas(turnoAtivo) {
  const [paradas, setParadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");

  async function carregar() {
    setLoading(true);
    try {
      const data = await listParadas();
      setParadas(data.map(mapApiToUi));
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

  async function addParada(form) {
    try {
      const created = await createParada({ ...toApiPayload(form), turnoAtivo });
      setParadas((prev) => [mapApiToUi(created), ...prev]);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function updateParadaFn(id, form) {
    try {
      const updated = await updateParada(id, { ...toApiPayload(form), turnoAtivo });
      setParadas((prev) => prev.map((p) => (p.id === id ? mapApiToUi(updated) : p)));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function removeParadaFn(id) {
    try {
      await removeParada(id);
      setParadas((prev) => prev.filter((p) => p.id !== id));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  return {
    paradas,
    addParada,
    updateParada: updateParadaFn,
    removeParada: removeParadaFn,
    loading,
    erroCarregamento,
  };
}
