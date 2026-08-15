import { useMemo, useState } from "react";
import { getStatusOrdem } from "../utils/ordens";

/**
 * Centraliza o estado e as regras de negócio da ordem de produção do dia:
 * quais peças/lotes vão embora, a quantidade combinada (meta), se são
 * prioridade e (opcionalmente) o horário em que a peça sai. Depois que a
 * peça sai, dá pra registrar quanto foi realmente enviado — se não bater
 * a meta, a ordem fica marcada como "incompleta" em vez de "concluída".
 * A lista fica sempre ordenada com as prioridades no topo e, dentro de
 * cada grupo, pelo horário de saída.
 */
export function useOrdensProducao() {
  const [ordens, setOrdens] = useState([]);

  function validar({ peca, lote, quantidade }) {
    if (!peca.trim()) return { ok: false, error: "Informe o número/modelo da peça." };
    if (!lote.trim()) return { ok: false, error: "Informe o lote." };
    const qtd = Number(quantidade);
    if (!quantidade || isNaN(qtd) || qtd <= 0) {
      return { ok: false, error: "Informe a quantidade a enviar." };
    }
    return { ok: true };
  }

  function addOrdem({ peca, lote, quantidade, prioridade, horarioSaida }) {
    const result = validar({ peca, lote, quantidade });
    if (!result.ok) return result;

    setOrdens((prev) => [
      {
        id: Date.now(),
        peca: peca.trim(),
        lote: lote.trim(),
        quantidade: Number(quantidade),
        quantidadeEnviada: null,
        prioridade: !!prioridade,
        horarioSaida: horarioSaida || "",
        data: new Date(),
      },
      ...prev,
    ]);

    return { ok: true };
  }

  function updateOrdem(id, { peca, lote, quantidade, prioridade, horarioSaida }) {
    const result = validar({ peca, lote, quantidade });
    if (!result.ok) return result;

    setOrdens((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              peca: peca.trim(),
              lote: lote.trim(),
              quantidade: Number(quantidade),
              prioridade: !!prioridade,
              horarioSaida: horarioSaida || "",
            }
          : o
      )
    );

    return { ok: true };
  }

  // Registra quanto foi de fato enviado. Se vier menor que a meta, a
  // ordem continua na lista marcada como "incompleta" (não bateu a meta)
  // em vez de sumir ou virar "concluída" incorretamente.
  function registrarEnvio(id, quantidadeEnviada) {
    const qtd = Number(quantidadeEnviada);
    if (quantidadeEnviada === "" || isNaN(qtd) || qtd < 0) {
      return { ok: false, error: "Informe a quantidade enviada." };
    }

    setOrdens((prev) =>
      prev.map((o) => (o.id === id ? { ...o, quantidadeEnviada: qtd } : o))
    );

    return { ok: true };
  }

  // Desfaz o registro de envio, voltando a ordem para "pendente".
  function limparEnvio(id) {
    setOrdens((prev) =>
      prev.map((o) => (o.id === id ? { ...o, quantidadeEnviada: null } : o))
    );
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

  const totalMeta = useMemo(
    () => ordens.reduce((sum, o) => sum + o.quantidade, 0),
    [ordens]
  );

  const totalEnviado = useMemo(
    () => ordens.reduce((sum, o) => sum + (o.quantidadeEnviada || 0), 0),
    [ordens]
  );

  const totalCompletas = useMemo(
    () => ordens.filter((o) => getStatusOrdem(o) === "completo").length,
    [ordens]
  );

  const totalIncompletas = useMemo(
    () => ordens.filter((o) => getStatusOrdem(o) === "incompleto").length,
    [ordens]
  );

  return {
    ordens: ordensOrdenadas,
    addOrdem,
    updateOrdem,
    registrarEnvio,
    limparEnvio,
    removeOrdem,
    totalOrdens: ordens.length,
    totalPrioridades,
    totalMeta,
    totalEnviado,
    totalCompletas,
    totalIncompletas,
  };
}
