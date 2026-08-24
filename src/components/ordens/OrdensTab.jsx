import { useMemo } from "react";
import { NovaOrdemForm } from "./NovaOrdemForm";
import { OrdensTable } from "./OrdensTable";
import { ResumoOrdens } from "./ResumoOrdens";
import { TURNO_TODOS } from "../../constants";
import { getTurnoLabel } from "../../utils/turnos";
import { useAuth } from "../../context/AuthContext";

export function OrdensTab({ ordens, addOrdem, updateOrdem, removeOrdem, turnoFiltro, catalogoPecas }) {
  const { isAdmin } = useAuth();
  const ordensFiltradas = useMemo(
    () => (turnoFiltro === TURNO_TODOS ? ordens : ordens.filter((o) => o.turno === turnoFiltro)),
    [ordens, turnoFiltro]
  );

  const totalOrdens = ordensFiltradas.length;
  const totalPrioridades = useMemo(
    () => ordensFiltradas.filter((o) => o.prioridade).length,
    [ordensFiltradas]
  );
  const totalMeta = useMemo(
    () => ordensFiltradas.reduce((sum, o) => sum + o.quantidade, 0),
    [ordensFiltradas]
  );
  const totalProduzido = useMemo(
    () => ordensFiltradas.reduce((sum, o) => sum + o.quantidadeProduzida, 0),
    [ordensFiltradas]
  );

  const titulo =
    turnoFiltro === TURNO_TODOS
      ? "Resumo da ordem do dia"
      : `Resumo da ordem do ${getTurnoLabel(turnoFiltro).toLowerCase()}`;

  return (
    <>
      {isAdmin && <NovaOrdemForm onAdd={addOrdem} />}
      {!isAdmin && (
        <div className="ptk-panel">
          <p className="ptk-sub" style={{ margin: 0 }}>
            Somente administradores podem criar, editar ou remover ordens de produção. Você pode
            acompanhar o andamento abaixo.
          </p>
        </div>
      )}
      <OrdensTable
        ordens={ordensFiltradas}
        onUpdate={updateOrdem}
        onRemove={removeOrdem}
        catalogoPecas={catalogoPecas}
        readOnly={!isAdmin}
      />
      <ResumoOrdens
        titulo={titulo}
        totalOrdens={totalOrdens}
        totalPrioridades={totalPrioridades}
        totalMeta={totalMeta}
        totalProduzido={totalProduzido}
      />
    </>
  );
}
