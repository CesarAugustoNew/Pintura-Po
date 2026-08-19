import * as XLSX from "xlsx";
import { formatDatePtBr } from "./date";
import { getTurnoLabel } from "./turnos";

/**
 * Gera e baixa um arquivo .xlsx com os lançamentos (uma aba) e o resumo
 * (outra aba) do período exibido na tela — o dia inteiro ou só um turno,
 * dependendo do que estiver selecionado no momento da exportação.
 */
export function exportarLancamentosExcel({
  entries,
  totalPecasDia,
  totalBarrasDia,
  porModelo,
  today,
  titulo = "Resumo do dia",
}) {
  const wb = XLSX.utils.book_new();

  // Aba 1: Lançamentos
  const lancamentosHeader = [
    "Peça",
    "Lote",
    "Turno",
    "Início",
    "Qtd/barra",
    "Barra inicial",
    "Barra final",
    "Barras usadas",
    "Total de peças",
  ];
  const lancamentosRows = entries.map((e) => [
    e.isSetup ? "SETUP (troca de tinta)" : e.peca,
    e.isSetup ? "—" : e.lote,
    getTurnoLabel(e.turno),
    e.horaInicio || "",
    e.isSetup ? "—" : e.qtdPorBarra,
    e.barraInicial,
    e.barraFinal,
    e.barrasUsadas,
    e.totalPecas,
  ]);
  const wsLancamentos = XLSX.utils.aoa_to_sheet([lancamentosHeader, ...lancamentosRows]);
  wsLancamentos["!cols"] = lancamentosHeader.map(() => ({ wch: 14 }));
  XLSX.utils.book_append_sheet(wb, wsLancamentos, "Lançamentos");

  // Aba 2: Resumo
  const resumoTop = [
    [titulo, formatDatePtBr(today)],
    [],
    ["Total de peças", totalPecasDia],
    ["Barras usadas", totalBarrasDia],
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
  XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");

  const dataArquivo = today.toISOString().slice(0, 10);
  const sufixoTurno = titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  XLSX.writeFile(wb, `${sufixoTurno}-${dataArquivo}.xlsx`);
}
