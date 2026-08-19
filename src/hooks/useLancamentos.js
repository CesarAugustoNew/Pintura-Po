import { useState } from "react";
import { validarECalcularLancamento } from "../utils/validarLancamento";

/**
 * Centraliza o estado e as regras de negócio dos lançamentos de barras:
 * validação e cálculo de barras usadas/total de peças.
 *
 * O turno de cada lançamento é calculado a partir do horário de início; se
 * ele ficar em branco, usa `turnoAtivo` (o turno selecionado no momento)
 * como padrão, então todo lançamento sempre acaba com um turno definido.
 * Os totais do dia/turno (peças, barras, por modelo) ficam por conta de
 * `calcularResumoLancamentos`, aplicada sobre a lista já filtrada por quem
 * usa este hook.
 */
export function useLancamentos(turnoAtivo) {
  const [entries, setEntries] = useState([]);

  function addEntry(form) {
    const result = validarECalcularLancamento(form, entries);
    if (!result.ok) return result;

    const turno = result.data.turno || turnoAtivo;
    setEntries((prev) => [...prev, { id: Date.now(), ...result.data, turno }]);
    return { ok: true };
  }

  function updateEntry(id, form) {
    const outros = entries.filter((e) => e.id !== id);
    const result = validarECalcularLancamento(form, outros);
    if (!result.ok) return result;

    const turno = result.data.turno || turnoAtivo;
    setEntries((prev) => prev.map((e) => (e.id === id ? { id, ...result.data, turno } : e)));
    return { ok: true };
  }

  function removeEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return { entries, addEntry, updateEntry, removeEntry };
}
