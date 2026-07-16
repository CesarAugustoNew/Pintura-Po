import { useCatalogoPecas } from "../../hooks/useCatalogoPecas";
import { CadastrarPecaForm } from "./CadastrarPecaForm";
import { PecasGrid } from "./PecasGrid";

export function CatalogoTab() {
  const { pecas, pecasFiltradas, busca, setBusca, addPeca, removePeca } = useCatalogoPecas();

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
