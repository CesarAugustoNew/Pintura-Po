import { useMemo, useState } from "react";

/**
 * Centraliza o estado e as regras de negócio da ordem de produção do dia:
 * quais peças/lotes vão embora, se são prioridade e (opcionalmente) o
 * horário em que a peça sai. A lista fica sempre ordenada com as
 * prioridades no topo e, dentro de cada grupo, pelo horário de saída.
 */
export function useOrdensProducao() {
  const [ordens, setOrdens] = useState([]);

  function validar({ peca, lote }) {
    if (!peca.trim()) return { ok: false, error: "Informe o número/modelo da peça." };
    if (!lote.trim()) return { ok: false, error: "Informe o lote." };
    return { ok: true };
  }

  function addOrdem({ peca, lote, prioridade, horarioSaida }) {
    const result = validar({ peca, lote });
    if (!result.ok) return result;

    setOrdens((prev) => [
      {
        id: Date.now(),
        peca: peca.trim(),
        lote: lote.trim(),
        prioridade: !!prioridade,
        horarioSaida: horarioSaida || "",
        data: new Date(),
      },
      ...prev,
    ]);

    return { ok: true };
  }

  function updateOrdem(id, { peca, lote, prioridade, horarioSaida }) {
    const result = validar({ peca, lote });
    if (!result.ok) return result;

    setOrdens((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              peca: peca.trim(),
              lote: lote.trim(),
              prioridade: !!prioridade,
              horarioSaida: horarioSaida || "",
            }
          : o
      )
    );

    return { ok: true };
  }

  function removeOrdem(id) {
    setOrdens((prev) => prev.filter((o) => o.id !== id));
  }

  // Prioridade primeiro; dentro do mesmo grupo, quem tem horário de saída
  // definido vem em ordem crescente, e quem não tem fica por último
  // (mantendo a ordem de registro entre eles).
  const ordensOrdenadas = useMemo(() => {
    return [...ordens].sort((a, b) => {
      if (a.prioridade !== b.prioridade) return a.prioridade ? -1 : 1;
      if (a.horarioSaida && b.horarioSaida) return a.horarioSaida.localeCompare(b.horarioSaida);
      if (a.horarioSaida) return -1;
      if (b.horarioSaida) return 1;
      return 0;
    });
  }, [ordens]);

  const totalPrioridades = useMemo(
    () => ordens.filter((o) => o.prioridade).length,
    [ordens]
  );

  return {
    ordens: ordensOrdenadas,
    addOrdem,
    updateOrdem,
    removeOrdem,
    totalOrdens: ordens.length,
    totalPrioridades,
  };
}
