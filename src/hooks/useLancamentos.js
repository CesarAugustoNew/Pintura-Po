import { useMemo, useState } from "react";
import { validarECalcularLancamento } from "../utils/validarLancamento";

/**
 * Centraliza o estado e as regras de negócio dos lançamentos de barras:
 * validação, cálculo de barras usadas/total de peças e os totais do dia.
 */
export function useLancamentos() {
  const [entries, setEntries] = useState([]);

  function addEntry(form) {
    const result = validarECalcularLancamento(form, entries);
    if (!result.ok) return result;

    setEntries((prev) => [...prev, { id: Date.now(), ...result.data }]);
    return { ok: true };
  }

  function updateEntry(id, form) {
    const outros = entries.filter((e) => e.id !== id);
    const result = validarECalcularLancamento(form, outros);
    if (!result.ok) return result;

    setEntries((prev) => prev.map((e) => (e.id === id ? { id, ...result.data } : e)));
    return { ok: true };
  }

  function removeEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const totalPecasDia = useMemo(() => entries.reduce((s, e) => s + e.totalPecas, 0), [entries]);
  const totalBarrasDia = useMemo(() => entries.reduce((s, e) => s + e.barrasUsadas, 0), [entries]);

  const porModelo = useMemo(() => {
    const map = new Map();
    entries
      .filter((e) => !e.isSetup)
      .forEach((e) => {
        if (!map.has(e.peca)) map.set(e.peca, { peca: e.peca, totalPecas: 0, lotes: new Set(), barras: 0 });
        const item = map.get(e.peca);
        item.totalPecas += e.totalPecas;
        item.lotes.add(e.lote);
        item.barras += e.barrasUsadas;
      });
    return Array.from(map.values()).sort((a, b) => b.totalPecas - a.totalPecas);
  }, [entries]);

  return { entries, addEntry, updateEntry, removeEntry, totalPecasDia, totalBarrasDia, porModelo };
}
