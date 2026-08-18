import * as XLSX from "xlsx";
import { formatDatePtBr } from "./date";

/**
 * Gera e baixa um arquivo .xlsx com os lançamentos de hoje (uma aba) e o
 * resumo do dia (outra aba), a partir dos mesmos dados exibidos na tela.
 */
export function exportarLancamentosExcel({ entries, totalPecasDia, totalBarrasDia, porModelo, today }) {
  const wb = XLSX.utils.book_new();

  // Aba 1: Lançamentos de hoje
  const lancamentosHeader = [
    "Peça",
    "Lote",
    "Início",
    "Qtd/barra",
    "Barra inicial",
    "Barra final",
    "Barras usadas",
    "Total de peças",
  ];
  const lancamentosRows = entries.map((e) => [
    e.peca,
    e.lote,
    e.horaInicio || "",
    e.qtdPorBarra,
    e.barraInicial,
    e.barraFinal,
    e.barrasUsadas,
    e.totalPecas,
  ]);
  const wsLancamentos = XLSX.utils.aoa_to_sheet([lancamentosHeader, ...lancamentosRows]);
  wsLancamentos["!cols"] = lancamentosHeader.map(() => ({ wch: 14 }));
  XLSX.utils.book_append_sheet(wb, wsLancamentos, "Lançamentos de hoje");

  // Aba 2: Resumo do dia
  const resumoTop = [
    ["Resumo do dia", formatDatePtBr(today)],
    [],
    ["Total de peças hoje", totalPecasDia],
    ["Barras usadas hoje", totalBarrasDia],
    ["Modelos diferentes", porModelo.length],
    [],
    ["Peça / Modelo", "Lotes", "Barras usadas", "Total de peças"],
  ];
  const resumoRows = porModelo.map((m) => [
    m.peca,
    Array.from(m.lotes).join(", "),
    m.barras,
    m.totalPecas,
  ]);
  const wsResumo = XLSX.utils.aoa_to_sheet([...resumoTop, ...resumoRows]);
  wsResumo["!cols"] = [{ wch: 20 }, { wch: 24 }, { wch: 14 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo do dia");

  const dataArquivo = today.toISOString().slice(0, 10);
  XLSX.writeFile(wb, `lancamentos-${dataArquivo}.xlsx`);
}
