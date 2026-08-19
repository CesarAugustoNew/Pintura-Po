import { useMemo } from "react";
import { NovoParadaForm } from "./NovoParadaForm";
import { ParadasTable } from "./ParadasTable";
import { ResumoParadas } from "./ResumoParadas";
import { TURNO_TODOS } from "../../constants";
import { getTurnoLabel } from "../../utils/turnos";

export function ParadasTab({ paradas, addParada, updateParada, removeParada, turnoFiltro }) {
  const paradasFiltradas = useMemo(
    () => (turnoFiltro === TURNO_TODOS ? paradas : paradas.filter((p) => p.turno === turnoFiltro)),
    [paradas, turnoFiltro]
  );

  const totalMinutosParado = useMemo(
    () => paradasFiltradas.reduce((s, p) => s + p.duracaoMinutos, 0),
    [paradasFiltradas]
  );

  const titulo =
    turnoFiltro === TURNO_TODOS ? "Resumo de paradas" : `Resumo de paradas do ${getTurnoLabel(turnoFiltro).toLowerCase()}`;
  const tituloTabela =
    turnoFiltro === TURNO_TODOS ? "Paradas registradas" : `Paradas do ${getTurnoLabel(turnoFiltro).toLowerCase()}`;

  return (
    <>
      <NovoParadaForm onAdd={addParada} />
      <ParadasTable paradas={paradasFiltradas} onUpdate={updateParada} onRemove={removeParada} titulo={tituloTabela} />
      <ResumoParadas titulo={titulo} totalMinutosParado={totalMinutosParado} totalRegistros={paradasFiltradas.length} />
    </>
  );
}
