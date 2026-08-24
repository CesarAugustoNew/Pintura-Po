import { CadastrarPecaForm } from "./CadastrarPecaForm";
import { PecasGrid } from "./PecasGrid";
import { useAuth } from "../../context/AuthContext";

export function CatalogoTab({ pecas, pecasFiltradas, busca, setBusca, addPeca, removePeca }) {
  const { isAdmin } = useAuth();

  return (
    <>
      {isAdmin && <CadastrarPecaForm onAdd={addPeca} />}
      {!isAdmin && (
        <div className="ptk-panel">
          <p className="ptk-sub" style={{ margin: 0 }}>
            Somente administradores podem cadastrar ou remover peças do catálogo.
          </p>
        </div>
      )}
      <PecasGrid
        pecas={pecas}
        pecasFiltradas={pecasFiltradas}
        busca={busca}
        onBuscaChange={setBusca}
        onRemove={removePeca}
        readOnly={!isAdmin}
      />
    </>
  );
}
