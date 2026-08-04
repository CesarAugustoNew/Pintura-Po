import { TOTAL_BARRAS } from "../constants";
import { buildBarraSequence } from "./barras";

/**
 * Valida os campos de um lançamento e calcula barras usadas / total de peças.
 * Usado tanto ao adicionar um lançamento novo quanto ao editar um já existente.
 *
 * As barras giram em ciclo (1 até TOTAL_BARRAS e reinicia em 1), então é normal
 * e esperado que o mesmo número de barra apareça em mais de um lançamento do dia
 * — assim que a embalagem retira as peças, a barra volta a ficar disponível.
 */
export function validarECalcularLancamento(
  { peca, lote, qtdPorBarra, barraInicial, barraFinal, qtdUltimaBarra, horaInicio },
  outrosLancamentosDoDia
) {
  const qtd = parseInt(qtdPorBarra, 10);
  const bi = parseInt(barraInicial, 10);
  const bf = parseInt(barraFinal, 10);
  const temUltimaParcial = qtdUltimaBarra !== "" && qtdUltimaBarra !== undefined && qtdUltimaBarra !== null;
  const qtdUltima = temUltimaParcial ? parseInt(qtdUltimaBarra, 10) : null;

  if (!peca.trim()) return { ok: false, error: "Informe o número/modelo da peça." };
  if (!lote.trim()) return { ok: false, error: "Informe o lote." };
  if (isNaN(qtd) || qtd < 1) return { ok: false, error: "Informe a quantidade por barra." };
  if (isNaN(bi) || isNaN(bf)) return { ok: false, error: "Informe a barra inicial e final." };
  if (bi < 1 || bi > TOTAL_BARRAS || bf < 1 || bf > TOTAL_BARRAS)
    return { ok: false, error: `A numeração da barra deve ser de 1 a ${TOTAL_BARRAS}.` };
  if (temUltimaParcial && (isNaN(qtdUltima) || qtdUltima < 0 || qtdUltima > qtd))
    return { ok: false, error: "A quantidade na última barra deve ser de 0 até a quantidade por barra." };

  const barraSequence = buildBarraSequence(bi, bf);
  const barrasUsadas = barraSequence.length;
  const totalPecas = temUltimaParcial ? qtd * (barrasUsadas - 1) + qtdUltima : qtd * barrasUsadas;

  return {
    ok: true,
    data: {
      peca: peca.trim(),
      lote: lote.trim(),
      qtdPorBarra: qtd,
      qtdUltimaBarra: temUltimaParcial ? qtdUltima : null,
      barraInicial: bi,
      barraFinal: bf,
      barraSequence,
      barrasUsadas,
      totalPecas,
      horaInicio: (horaInicio || "").trim(),
    },
  };
}
