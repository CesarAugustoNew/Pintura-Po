import { HeroBar } from "../common/HeroBar";
import { EmbalagemPanel } from "../common/EmbalagemPanel";
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
  catalogoPecas,
}) {
  return (
    <>
      <div className="ptk-hero">
        <HeroBar />
      </div>

      <NovoLancamentoForm onAdd={addEntry} />
      <LancamentosTable entries={entries} onUpdate={updateEntry} onRemove={removeEntry} />
      <ResumoDia entries={entries} totalPecasDia={totalPecasDia} totalBarrasDia={totalBarrasDia} porModelo={porModelo} />
      <EmbalagemPanel codigos={entries.filter((e) => !e.isSetup).map((e) => e.peca)} catalogoPecas={catalogoPecas} />
    </>
  );
}
