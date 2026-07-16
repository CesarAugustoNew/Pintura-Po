import { useMemo, useState } from "react";
import { FUROS_POR_BARRA, TOTAL_BARRAS } from "../constants";
import { buildBarraSequence } from "../utils/barras";

/**
 * Centraliza o estado e as regras de negócio dos lançamentos de barras:
 * validação, cálculo de barras usadas/total de peças e os totais do dia.
 */
export function useLancamentos() {
  const [entries, setEntries] = useState([]);

  function addEntry({ peca, lote, qtdPorBarra, barraInicial, barraFinal }) {
    const qtd = parseInt(qtdPorBarra, 10);
    const bi = parseInt(barraInicial, 10);
    const bf = parseInt(barraFinal, 10);

    if (!peca.trim()) return { ok: false, error: "Informe o número/modelo da peça." };
    if (!lote.trim()) return { ok: false, error: "Informe o lote." };
    if (isNaN(qtd) || qtd < 1 || qtd > FUROS_POR_BARRA)
      return { ok: false, error: `Quantidade por barra deve ser de 1 a ${FUROS_POR_BARRA}.` };
    if (isNaN(bi) || isNaN(bf)) return { ok: false, error: "Informe a barra inicial e final." };
    if (bi < 1 || bi > TOTAL_BARRAS || bf < 1 || bf > TOTAL_BARRAS)
      return { ok: false, error: `A numeração da barra deve ser de 1 a ${TOTAL_BARRAS}.` };

    const barraSequence = buildBarraSequence(bi, bf);
    const barrasUsadas = barraSequence.length;

    const overlapWarning = entries.some((e) => e.barraSequence.some((n) => barraSequence.includes(n)));

    setEntries((prev) => [
      ...prev,
      {
        id: Date.now(),
        peca: peca.trim(),
        lote: lote.trim(),
        qtdPorBarra: qtd,
        barraInicial: bi,
        barraFinal: bf,
        barraSequence,
        barrasUsadas,
        totalPecas: qtd * barrasUsadas,
        overlapWarning,
      },
    ]);

    return { ok: true };
  }

  function removeEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const totalPecasDia = useMemo(() => entries.reduce((s, e) => s + e.totalPecas, 0), [entries]);
  const totalBarrasDia = useMemo(() => entries.reduce((s, e) => s + e.barrasUsadas, 0), [entries]);

  const porModelo = useMemo(() => {
    const map = new Map();
    entries.forEach((e) => {
      if (!map.has(e.peca)) map.set(e.peca, { peca: e.peca, totalPecas: 0, lotes: new Set(), barras: 0 });
      const item = map.get(e.peca);
      item.totalPecas += e.totalPecas;
      item.lotes.add(e.lote);
      item.barras += e.barrasUsadas;
    });
    return Array.from(map.values()).sort((a, b) => b.totalPecas - a.totalPecas);
  }, [entries]);

  return { entries, addEntry, removeEntry, totalPecasDia, totalBarrasDia, porModelo };
}
