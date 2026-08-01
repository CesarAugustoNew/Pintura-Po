import { HeroBar } from "../common/HeroBar";
import { NovoLancamentoForm } from "./NovoLancamentoForm";
import { LancamentosTable } from "./LancamentosTable";
import { ResumoDia } from "./ResumoDia";

export function LancamentosTab({
  entries,
  addEntry,
  updateEntry,
  removeEntry,
  totalPecasDia,
  totalBarrasDia,
  porModelo,
}) {
  return (
    <>
      <div className="ptk-hero">
        <HeroBar />
      </div>

      <NovoLancamentoForm onAdd={addEntry} />
      <LancamentosTable entries={entries} onUpdate={updateEntry} onRemove={removeEntry} />
      <ResumoDia totalPecasDia={totalPecasDia} totalBarrasDia={totalBarrasDia} porModelo={porModelo} />
    </>
  );
}
