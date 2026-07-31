import { useSobras } from "../../hooks/useSobras";
import { NovoSobraForm } from "./NovoSobraForm";
import { SobrasTable } from "./SobrasTable";
import { ResumoSobras } from "./ResumoSobras";

export function SobrasTab() {
  const { sobras, addSobra, updateSobra, removeSobra, totalSobras } = useSobras();

  return (
    <>
      <NovoSobraForm onAdd={addSobra} />
      <SobrasTable sobras={sobras} onUpdate={updateSobra} onRemove={removeSobra} />
      <ResumoSobras totalSobras={totalSobras} totalRegistros={sobras.length} />
    </>
  );
}
