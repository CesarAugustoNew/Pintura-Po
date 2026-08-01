import { NovoSobraForm } from "./NovoSobraForm";
import { SobrasTable } from "./SobrasTable";
import { ResumoSobras } from "./ResumoSobras";

export function SobrasTab({ sobras, addSobra, updateSobra, removeSobra, totalSobras }) {
  return (
    <>
      <NovoSobraForm onAdd={addSobra} />
      <SobrasTable sobras={sobras} onUpdate={updateSobra} onRemove={removeSobra} />
      <ResumoSobras totalSobras={totalSobras} totalRegistros={sobras.length} />
    </>
  );
}
