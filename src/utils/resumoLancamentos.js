/**
 * Calcula os totais (peças, barras, por modelo) a partir de uma lista de
 * lançamentos. Recebe a lista já filtrada por quem chama — o mesmo cálculo
 * serve tanto para "todos os turnos" quanto para um turno específico.
 */
export function calcularResumoLancamentos(entries) {
  const totalPecasDia = entries.reduce((s, e) => s + e.totalPecas, 0);
  const totalBarrasDia = entries.reduce((s, e) => s + e.barrasUsadas, 0);

  const map = new Map();
  entries
    .filter((e) => !e.isSetup)
    .forEach((e) => {
      if (!map.has(e.peca)) map.set(e.peca, { peca: e.peca, totalPecas: 0, lotes: new Set(), barras: 0 });
      const item = map.get(e.peca);
      item.totalPecas += e.totalPecas;
      item.lotes.add(e.lote);
      item.barras += e.barrasUsadas;
    });
  const porModelo = Array.from(map.values()).sort((a, b) => b.totalPecas - a.totalPecas);

  return { totalPecasDia, totalBarrasDia, porModelo };
}
