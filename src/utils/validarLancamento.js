import { TOTAL_BARRAS } from "../constants";
import { buildBarraSequence } from "./barras";
import { getTurnoPorHorario } from "./turnos";

/**
 * Valida os campos de um lançamento e calcula barras usadas / total de peças.
 * Usado tanto ao adicionar um lançamento novo quanto ao editar um já existente.
 *
 * As barras giram em ciclo (1 até TOTAL_BARRAS e reinicia em 1), então é normal
 * e esperado que o mesmo número de barra apareça em mais de um lançamento do dia
 * — assim que a embalagem retira as peças, a barra volta a ficar disponível.
 *
 * Quando `isSetup` é true, o lançamento representa uma troca de tinta: as
 * barras do intervalo passam pela limpeza e não carregam peça nenhuma, então
 * peça/lote/qtd por barra não são exigidos e o total de peças fica zerado.
 *
 * O turno é calculado a partir do horário de início, quando informado. Se o
 * campo ficar em branco, `turno` volta `null` e quem chama (o hook) aplica
 * o turno ativo no momento como padrão.
 */
export function validarECalcularLancamento(
  { peca, lote, qtdPorBarra, barraInicial, barraFinal, qtdUltimaBarra, horaInicio, isSetup },
  outrosLancamentosDoDia
) {
  const bi = parseInt(barraInicial, 10);
  const bf = parseInt(barraFinal, 10);

  if (isNaN(bi) || isNaN(bf)) return { ok: false, error: "Informe a barra inicial e final." };
  if (bi < 1 || bi > TOTAL_BARRAS || bf < 1 || bf > TOTAL_BARRAS)
    return { ok: false, error: `A numeração da barra deve ser de 1 a ${TOTAL_BARRAS}.` };

  const barraSequence = buildBarraSequence(bi, bf);
  const barrasUsadas = barraSequence.length;
  const horaInicioLimpa = (horaInicio || "").trim();
  const turno = getTurnoPorHorario(horaInicioLimpa);

  if (isSetup) {
    return {
      ok: true,
      data: {
        isSetup: true,
        peca: "SETUP",
        lote: "",
        qtdPorBarra: 0,
        qtdUltimaBarra: null,
        barraInicial: bi,
        barraFinal: bf,
        barraSequence,
        barrasUsadas,
        totalPecas: 0,
        horaInicio: horaInicioLimpa,
        turno,
      },
    };
  }

  const qtd = parseInt(qtdPorBarra, 10);
  const temUltimaParcial = qtdUltimaBarra !== "" && qtdUltimaBarra !== undefined && qtdUltimaBarra !== null;
  const qtdUltima = temUltimaParcial ? parseInt(qtdUltimaBarra, 10) : null;

  if (!peca.trim()) return { ok: false, error: "Informe o número/modelo da peça." };
  if (!lote.trim()) return { ok: false, error: "Informe o lote." };
  if (isNaN(qtd) || qtd < 1) return { ok: false, error: "Informe a quantidade por barra." };
  if (temUltimaParcial && (isNaN(qtdUltima) || qtdUltima < 0 || qtdUltima > qtd))
    return { ok: false, error: "A quantidade na última barra deve ser de 0 até a quantidade por barra." };

  const totalPecas = temUltimaParcial ? qtd * (barrasUsadas - 1) + qtdUltima : qtd * barrasUsadas;

  return {
    ok: true,
    data: {
      isSetup: false,
      peca: peca.trim().toUpperCase(),
      lote: lote.trim().toUpperCase(),
      qtdPorBarra: qtd,
      qtdUltimaBarra: temUltimaParcial ? qtdUltima : null,
      barraInicial: bi,
      barraFinal: bf,
      barraSequence,
      barrasUsadas,
      totalPecas,
      horaInicio: horaInicioLimpa,
      turno,
    },
  };
}
