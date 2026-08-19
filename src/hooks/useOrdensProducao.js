import { useMemo, useState } from "react";
import { getTurnoPorHorario } from "../utils/turnos";

/**
 * Centraliza o estado e as regras de negócio da ordem de produção do dia:
 * quais peças/lotes precisam sair, a quantidade combinada (meta) e se são
 * prioridade. A quantidade já produzida é abatida automaticamente pelos
 * lançamentos de pintura da mesma peça E do mesmo turno da ordem — o lote
 * do lançamento não precisa bater com o lote da ordem (a mesma peça pode
 * ser pintada em lotes diferentes e tudo conta pra mesma meta), mas o
 * turno precisa, já que cada turno tem sua própria ordem de produção,
 * independente dos outros turnos (sem contar setups, que não têm peça de
 * verdade). Assim que o lançamento é feito, a ordem soma a produção e vai
 * ficando mais perto de "concluída" sozinha, sem precisar registrar nada
 * manualmente.
 *
 * Assim como os lançamentos, o turno de cada ordem é calculado a partir do
 * horário de saída; se ficar em branco, usa `turnoAtivo` como padrão.
 *
 * A lista fica sempre ordenada com as prioridades no topo e, dentro de
 * cada grupo, pelo horário de saída.
 */
export function useOrdensProducao(lancamentos = [], turnoAtivo) {
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

    const turno = getTurnoPorHorario(horarioSaida) || turnoAtivo;

    setOrdens((prev) => [
      {
        id: Date.now(),
        peca: peca.trim().toUpperCase(),
        lote: lote.trim().toUpperCase(),
        quantidade: Number(quantidade),
        prioridade: !!prioridade,
        horarioSaida: horarioSaida || "",
        turno,
        data: new Date(),
      },
      ...prev,
    ]);

    return { ok: true };
  }

  function updateOrdem(id, { peca, lote, quantidade, prioridade, horarioSaida }) {
    const result = validar({ peca, lote, quantidade });
    if (!result.ok) return result;

    const turno = getTurnoPorHorario(horarioSaida) || turnoAtivo;

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
              turno,
            }
          : o
      )
    );

    return { ok: true };
  }

  function removeOrdem(id) {
    setOrdens((prev) => prev.filter((o) => o.id !== id));
  }

  // Soma, por turno + peça, tudo que já foi lançado (ignorando setups, que
  // não representam peça nenhuma). O lote do lançamento pode ser diferente
  // do lote da ordem, mas o turno tem que ser o mesmo.
  const produzidoPorTurnoPeca = useMemo(() => {
    const map = new Map();
    lancamentos
      .filter((l) => !l.isSetup)
      .forEach((l) => {
        const chave = `${l.turno}::${l.peca}`;
        map.set(chave, (map.get(chave) || 0) + l.totalPecas);
      });
    return map;
  }, [lancamentos]);

  // Ordens já com a quantidade produzida abatida automaticamente.
  const ordensComProducao = useMemo(() => {
    return ordens.map((o) => ({
      ...o,
      quantidadeProduzida: produzidoPorTurnoPeca.get(`${o.turno}::${o.peca}`) || 0,
    }));
  }, [ordens, produzidoPorTurnoPeca]);

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

  return { ordens: ordensOrdenadas, addOrdem, updateOrdem, removeOrdem };
}
