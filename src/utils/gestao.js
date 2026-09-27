import { TURNOS } from "../constants";

/** Intervalo [inicio, fim] (ambos Date) do dia informado, formato "yyyy-mm-dd". */
export function getIntervaloDia(dataStr) {
  const [y, m, d] = dataStr.split("-").map(Number);
  return {
    inicio: new Date(y, m - 1, d, 0, 0, 0, 0),
    fim: new Date(y, m - 1, d, 23, 59, 59, 999),
  };
}

/** Intervalo [inicio, fim] do mês informado, formato "yyyy-mm". */
export function getIntervaloMes(mesStr) {
  const [y, m] = mesStr.split("-").map(Number);
  return {
    inicio: new Date(y, m - 1, 1, 0, 0, 0, 0),
    // dia 0 do mês seguinte = último dia do mês atual
    fim: new Date(y, m, 0, 23, 59, 59, 999),
  };
}

/** Intervalo [inicio, fim] do semestre informado (1 = Jan–Jun, 2 = Jul–Dez). */
export function getIntervaloSemestre(ano, semestre) {
  const mesInicio = semestre === 1 ? 0 : 6;
  const mesFimExclusivo = semestre === 1 ? 6 : 12;
  return {
    inicio: new Date(ano, mesInicio, 1, 0, 0, 0, 0),
    fim: new Date(ano, mesFimExclusivo, 0, 23, 59, 59, 999),
  };
}

/** Filtra uma lista de registros (cada um com campo `.data`, um Date) para o intervalo [inicio, fim]. */
export function filtrarPorPeriodo(itens, inicio, fim) {
  return itens.filter((item) => item.data >= inicio && item.data <= fim);
}

/** Formata minutos totais como "Xh Ymin" (ex: 135 -> "2h 15min"). */
export function formatarMinutos(minutosTotais) {
  const horas = Math.floor(minutosTotais / 60);
  const minutos = minutosTotais % 60;
  if (horas === 0) return `${minutos}min`;
  if (minutos === 0) return `${horas}h`;
  return `${horas}h ${minutos}min`;
}

/**
 * Calcula os resultados de um turno específico dentro do período já
 * filtrado: produção (lançamentos), atendimento de ordens e paradas.
 * Sobras não têm turno associado, então entram só no total geral do
 * período (calculado por quem chama esta função).
 */
export function calcularResumoTurno(turnoId, { lancamentos, ordens, paradas }) {
  const lancamentosDoTurno = lancamentos.filter((l) => l.turno === turnoId);
  const lancamentosValidos = lancamentosDoTurno.filter((l) => !l.isSetup);
  const setups = lancamentosDoTurno.filter((l) => l.isSetup);

  const totalPecas = lancamentosValidos.reduce((s, l) => s + l.totalPecas, 0);
  const totalBarras = lancamentosDoTurno.reduce((s, l) => s + l.barrasUsadas, 0);

  const ordensDoTurno = ordens.filter((o) => o.turno === turnoId);
  const metaOrdens = ordensDoTurno.reduce((s, o) => s + o.quantidade, 0);
  const produzidoOrdens = ordensDoTurno.reduce((s, o) => s + (o.quantidadeProduzida || 0), 0);
  const atendimentoOrdens = metaOrdens > 0 ? Math.round((produzidoOrdens / metaOrdens) * 100) : null;

  const paradasDoTurno = paradas.filter((p) => p.turno === turnoId);
  const totalMinutosParado = paradasDoTurno.reduce((s, p) => s + p.duracaoMinutos, 0);

  return {
    turnoId,
    totalPecas,
    totalBarras,
    qtdLancamentos: lancamentosValidos.length,
    qtdSetups: setups.length,
    qtdOrdens: ordensDoTurno.length,
    metaOrdens,
    produzidoOrdens,
    atendimentoOrdens,
    qtdParadas: paradasDoTurno.length,
    totalMinutosParado,
  };
}

/** Monta o resumo dos 3 turnos, já filtrados no período. */
export function calcularResumoPorTurno(dados) {
  return TURNOS.map((t) => calcularResumoTurno(t.id, dados));
}
