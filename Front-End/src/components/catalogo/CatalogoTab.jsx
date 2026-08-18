import { CadastrarPecaForm } from "./CadastrarPecaForm";
import { PecasGrid } from "./PecasGrid";

export function CatalogoTab({ pecas, pecasFiltradas, busca, setBusca, addPeca, removePeca }) {
  return (
    <>
      <CadastrarPecaForm onAdd={addPeca} />
      <PecasGrid
        pecas={pecas}
        pecasFiltradas={pecasFiltradas}
        busca={busca}
        onBuscaChange={setBusca}
        onRemove={removePeca}
      />
    </>
  );
}
