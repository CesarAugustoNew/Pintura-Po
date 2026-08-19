import { useMemo, useState } from "react";
import { getStatusOrdem } from "../utils/ordens";

/**
 * Centraliza o estado e as regras de negócio da ordem de produção do dia:
 * quais peças/lotes precisam sair, a quantidade combinada (meta) e se são
 * prioridade. A quantidade já produzida é abatida automaticamente pelos
 * lançamentos de pintura da mesma peça — o lote do lançamento não precisa
 * bater com o lote da ordem, já que a mesma peça pode ser pintada em
 * lotes diferentes ao longo do dia e tudo conta pra mesma meta (sem
 * contar setups, que não têm peça de verdade). Assim que o lançamento é
 * feito, a ordem soma a produção e vai ficando mais perto de "concluída"
 * sozinha, sem precisar registrar nada manualmente.
 *
 * A lista fica sempre ordenada com as prioridades no topo e, dentro de
 * cada grupo, pelo horário de saída.
 */
export function useOrdensProducao(lancamentos = []) {
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
        peca: peca.trim().toUpperCase(),
        lote: lote.trim().toUpperCase(),
        quantidade: Number(quantidade),
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
              peca: peca.trim().toUpperCase(),
              lote: lote.trim().toUpperCase(),
              quantidade: Number(quantidade),
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

  // Soma, por peça, tudo que já foi lançado (ignorando setups, que não
  // representam peça nenhuma). O abate é só por peça — o lote do
  // lançamento pode ser diferente do lote da ordem, já que a mesma peça
  // pode ser pintada em lotes distintos ao longo do dia e tudo conta
  // pra mesma meta.
  const produzidoPorPeca = useMemo(() => {
    const map = new Map();
    lancamentos
      .filter((l) => !l.isSetup)
      .forEach((l) => {
        map.set(l.peca, (map.get(l.peca) || 0) + l.totalPecas);
      });
    return map;
  }, [lancamentos]);

  // Ordens já com a quantidade produzida abatida automaticamente.
  const ordensComProducao = useMemo(() => {
    return ordens.map((o) => ({
      ...o,
      quantidadeProduzida: produzidoPorPeca.get(o.peca) || 0,
    }));
  }, [ordens, produzidoPorPeca]);

  // Prioridade primeiro; dentro do mesmo grupo, quem tem horário de saída
  // definido vem em ordem crescente, e quem não tem fica por último
  // (mantendo a ordem de registro entre eles).
  const ordensOrdenadas = useMemo(() => {
    return [...ordensComProducao].sort((a, b) => {
      if (a.prioridade !== b.prioridade) return a.prioridade ? -1 : 1;
      if (a.horarioSaida && b.horarioSaida) return a.horarioSaida.localeCompare(b.horarioSaida);
      if (a.horarioSaida) return -1;
      if (b.horarioSaida) return 1;
      return 0;
    });
  }, [ordensComProducao]);

  const totalPrioridades = useMemo(
    () => ordens.filter((o) => o.prioridade).length,
    [ordens]
  );

  const totalMeta = useMemo(
    () => ordens.reduce((sum, o) => sum + o.quantidade, 0),
    [ordens]
  );

  const totalProduzido = useMemo(
    () => ordensComProducao.reduce((sum, o) => sum + o.quantidadeProduzida, 0),
    [ordensComProducao]
  );

  const totalCompletas = useMemo(
    () => ordensComProducao.filter((o) => getStatusOrdem(o) === "completo").length,
    [ordensComProducao]
  );

  const totalIncompletas = useMemo(
    () => ordensComProducao.filter((o) => getStatusOrdem(o) === "incompleto").length,
    [ordensComProducao]
  );

  return {
    ordens: ordensOrdenadas,
    addOrdem,
    updateOrdem,
    removeOrdem,
    totalOrdens: ordens.length,
    totalPrioridades,
    totalMeta,
    totalProduzido,
    totalCompletas,
    totalIncompletas,
  };
}
