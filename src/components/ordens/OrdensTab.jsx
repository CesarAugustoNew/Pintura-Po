import { NovaOrdemForm } from "./NovaOrdemForm";
import { OrdensTable } from "./OrdensTable";
import { ResumoOrdens } from "./ResumoOrdens";

export function OrdensTab({ ordens, addOrdem, updateOrdem, removeOrdem, totalOrdens, totalPrioridades }) {
  return (
    <>
      <NovaOrdemForm onAdd={addOrdem} />
      <OrdensTable ordens={ordens} onUpdate={updateOrdem} onRemove={removeOrdem} />
      <ResumoOrdens totalOrdens={totalOrdens} totalPrioridades={totalPrioridades} />
    </>
  );
}
