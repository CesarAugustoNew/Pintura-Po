import { HeroBar } from "../common/HeroBar";
import { useLancamentos } from "../../hooks/useLancamentos";
import { NovoLancamentoForm } from "./NovoLancamentoForm";
import { LancamentosTable } from "./LancamentosTable";
import { ResumoDia } from "./ResumoDia";

export function LancamentosTab() {
  const { entries, addEntry, removeEntry, totalPecasDia, totalBarrasDia, porModelo } = useLancamentos();

  return (
    <>
      <div className="ptk-hero">
        <HeroBar />
      </div>

      <NovoLancamentoForm onAdd={addEntry} />
      <LancamentosTable entries={entries} onRemove={removeEntry} />
      <ResumoDia totalPecasDia={totalPecasDia} totalBarrasDia={totalBarrasDia} porModelo={porModelo} />
    </>
  );
}
