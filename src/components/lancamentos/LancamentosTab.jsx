import { useMemo } from "react";
import { HeroBar } from "../common/HeroBar";
import { EmbalagemPanel } from "../common/EmbalagemPanel";
import { NovoLancamentoForm } from "./NovoLancamentoForm";
import { LancamentosTable } from "./LancamentosTable";
import { ResumoDia } from "./ResumoDia";
import { calcularResumoLancamentos } from "../../utils/resumoLancamentos";
import { TURNO_TODOS } from "../../constants";
import { getTurnoLabel } from "../../utils/turnos";

export function LancamentosTab({ entries, addEntry, updateEntry, removeEntry, catalogoPecas, turnoFiltro }) {
  const entriesFiltradas = useMemo(
    () => (turnoFiltro === TURNO_TODOS ? entries : entries.filter((e) => e.turno === turnoFiltro)),
    [entries, turnoFiltro]
  );

  const { totalPecasDia, totalBarrasDia, porModelo } = useMemo(
    () => calcularResumoLancamentos(entriesFiltradas),
    [entriesFiltradas]
  );

  const tituloResumo =
    turnoFiltro === TURNO_TODOS ? "Resumo do dia" : `Resumo do ${getTurnoLabel(turnoFiltro).toLowerCase()}`;
  const tituloTabela =
    turnoFiltro === TURNO_TODOS ? "Lançamentos de hoje" : `Lançamentos do ${getTurnoLabel(turnoFiltro).toLowerCase()}`;

  return (
    <>
      <div className="ptk-hero">
        <HeroBar />
      </div>

      <NovoLancamentoForm onAdd={addEntry} />
      <LancamentosTable entries={entriesFiltradas} onUpdate={updateEntry} onRemove={removeEntry} titulo={tituloTabela} />
      <ResumoDia
        entries={entriesFiltradas}
        totalPecasDia={totalPecasDia}
        totalBarrasDia={totalBarrasDia}
        porModelo={porModelo}
        titulo={tituloResumo}
      />
      <EmbalagemPanel
        codigos={entriesFiltradas.filter((e) => !e.isSetup).map((e) => e.peca)}
        catalogoPecas={catalogoPecas}
      />
    </>
  );
}
