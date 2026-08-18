import { useMemo, useState } from "react";
import { calcularDuracaoMinutos } from "../utils/paradas";

/**
 * Centraliza o estado e as regras de negócio das paradas de produção:
 * motivo, horário de início/fim e duração calculada automaticamente.
 */
export function useParadas() {
  const [paradas, setParadas] = useState([]);

  function validar({ motivo, horaInicio, horaFim }) {
    if (!motivo.trim()) return { ok: false, error: "Informe o motivo da parada." };
    if (!horaInicio) return { ok: false, error: "Informe o horário de início da parada." };
    if (!horaFim) return { ok: false, error: "Informe o horário de fim da parada." };

    const duracaoMinutos = calcularDuracaoMinutos(horaInicio, horaFim);
    if (duracaoMinutos === null || duracaoMinutos <= 0)
      return { ok: false, error: "Confira os horários: o fim deve ser depois do início." };

    return { ok: true, duracaoMinutos };
  }

  function addParada({ motivo, horaInicio, horaFim }) {
    const result = validar({ motivo, horaInicio, horaFim });
    if (!result.ok) return result;

    setParadas((prev) => [
      {
        id: Date.now(),
        motivo: motivo.trim(),
        horaInicio,
        horaFim,
        duracaoMinutos: result.duracaoMinutos,
        data: new Date(),
      },
      ...prev,
    ]);

    return { ok: true };
  }

  function updateParada(id, { motivo, horaInicio, horaFim }) {
    const result = validar({ motivo, horaInicio, horaFim });
    if (!result.ok) return result;

    setParadas((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, motivo: motivo.trim(), horaInicio, horaFim, duracaoMinutos: result.duracaoMinutos }
          : p
      )
    );

    return { ok: true };
  }

  function removeParada(id) {
    setParadas((prev) => prev.filter((p) => p.id !== id));
  }

  const totalMinutosParado = useMemo(
    () => paradas.reduce((s, p) => s + p.duracaoMinutos, 0),
    [paradas]
  );

  return { paradas, addParada, updateParada, removeParada, totalMinutosParado };
}
