import { NovoParadaForm } from "./NovoParadaForm";
import { ParadasTable } from "./ParadasTable";
import { ResumoParadas } from "./ResumoParadas";

export function ParadasTab({ paradas, addParada, updateParada, removeParada, totalMinutosParado }) {
  return (
    <>
      <NovoParadaForm onAdd={addParada} />
      <ParadasTable paradas={paradas} onUpdate={updateParada} onRemove={removeParada} />
      <ResumoParadas totalMinutosParado={totalMinutosParado} totalRegistros={paradas.length} />
    </>
  );
}
