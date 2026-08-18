import { NovaOrdemForm } from "./NovaOrdemForm";
import { OrdensTable } from "./OrdensTable";
import { ResumoOrdens } from "./ResumoOrdens";

export function OrdensTab({
  ordens,
  addOrdem,
  updateOrdem,
  registrarEnvio,
  limparEnvio,
  removeOrdem,
  totalOrdens,
  totalPrioridades,
  totalMeta,
  totalEnviado,
}) {
  return (
    <>
      <NovaOrdemForm onAdd={addOrdem} />
      <OrdensTable
        ordens={ordens}
        onUpdate={updateOrdem}
        onRemove={removeOrdem}
        onRegistrarEnvio={registrarEnvio}
        onLimparEnvio={limparEnvio}
      />
      <ResumoOrdens
        totalOrdens={totalOrdens}
        totalPrioridades={totalPrioridades}
        totalMeta={totalMeta}
        totalEnviado={totalEnviado}
      />
    </>
  );
}
