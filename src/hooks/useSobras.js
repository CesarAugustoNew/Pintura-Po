import { useMemo, useState } from "react";

/**
 * Centraliza o estado e as regras de negócio das sobras:
 * peças que sobraram (não fecharam barra, saíram de lote, etc.)
 * e ficam registradas à parte pra não se perder o controle delas.
 */
export function useSobras() {
  const [sobras, setSobras] = useState([]);

  function addSobra({ peca, lote, quantidade, observacao }) {
    if (!peca.trim()) return { ok: false, error: "Informe o número/modelo da peça." };

    const qtd = parseInt(quantidade, 10);
    if (isNaN(qtd) || qtd < 1) return { ok: false, error: "Informe a quantidade de sobra." };

    setSobras((prev) => [
      {
        id: Date.now(),
        peca: peca.trim().toUpperCase(),
        lote: lote.trim().toUpperCase(),
        quantidade: qtd,
        observacao: observacao.trim(),
        data: new Date(),
      },
      ...prev,
    ]);

    return { ok: true };
  }

  function updateSobra(id, { peca, lote, quantidade, observacao }) {
    if (!peca.trim()) return { ok: false, error: "Informe o número/modelo da peça." };

    const qtd = parseInt(quantidade, 10);
    if (isNaN(qtd) || qtd < 1) return { ok: false, error: "Informe a quantidade de sobra." };

    setSobras((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              peca: peca.trim().toUpperCase(),
              lote: lote.trim().toUpperCase(),
              quantidade: qtd,
              observacao: observacao.trim(),
            }
          : s
      )
    );

    return { ok: true };
  }

  function removeSobra(id) {
    setSobras((prev) => prev.filter((s) => s.id !== id));
  }

  const totalSobras = useMemo(() => sobras.reduce((s, e) => s + e.quantidade, 0), [sobras]);

  return { sobras, addSobra, updateSobra, removeSobra, totalSobras };
}
