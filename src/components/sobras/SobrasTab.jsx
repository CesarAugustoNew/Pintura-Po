import { NovoSobraForm } from "./NovoSobraForm";
import { SobrasTable } from "./SobrasTable";
import { ResumoSobras } from "./ResumoSobras";
import { EmbalagemPanel } from "../common/EmbalagemPanel";

export function SobrasTab({ sobras, addSobra, updateSobra, removeSobra, totalSobras, catalogoPecas }) {
  return (
    <>
      <NovoSobraForm onAdd={addSobra} />
      <SobrasTable sobras={sobras} onUpdate={updateSobra} onRemove={removeSobra} />
      <ResumoSobras totalSobras={totalSobras} totalRegistros={sobras.length} />
      <EmbalagemPanel codigos={sobras.map((s) => s.peca)} catalogoPecas={catalogoPecas} />
    </>
  );
}
