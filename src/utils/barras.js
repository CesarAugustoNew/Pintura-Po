import { TOTAL_BARRAS } from "../constants";

/**
 * Gera a sequência de números de barra entre `barraInicial` e `barraFinal`.
 * As barras ficam dispostas em ciclo: depois da última (TOTAL_BARRAS) volta pra 1.
 * Por isso barraFinal pode ser "menor" que barraInicial (ex: começa na 48, termina na 5).
 */
export function buildBarraSequence(barraInicial, barraFinal) {
  if (isNaN(barraInicial) || isNaN(barraFinal)) return [];
  if (barraInicial < 1 || barraInicial > TOTAL_BARRAS) return [];
  if (barraFinal < 1 || barraFinal > TOTAL_BARRAS) return [];

  const seq = [];
  let cur = barraInicial;
  for (let i = 0; i < TOTAL_BARRAS; i++) {
    seq.push(cur);
    if (cur === barraFinal) break;
    cur = cur === TOTAL_BARRAS ? 1 : cur + 1;
  }
  return seq;
}
