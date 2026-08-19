import { NovaOrdemForm } from "./NovaOrdemForm";
import { OrdensTable } from "./OrdensTable";
import { ResumoOrdens } from "./ResumoOrdens";

export function OrdensTab({
  ordens,
  addOrdem,
  updateOrdem,
  removeOrdem,
  totalOrdens,
  totalPrioridades,
  totalMeta,
  totalProduzido,
}) {
  return (
    <>
      <NovaOrdemForm onAdd={addOrdem} />
      <OrdensTable ordens={ordens} onUpdate={updateOrdem} onRemove={removeOrdem} />
      <ResumoOrdens
        totalOrdens={totalOrdens}
        totalPrioridades={totalPrioridades}
        totalMeta={totalMeta}
        totalProduzido={totalProduzido}
      />
    </>
  );
}
