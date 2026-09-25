import { useState } from "react";
import { PlusCircle, BookOpen } from "lucide-react";
import { CadastrarPecaForm } from "./CadastrarPecaForm";
import { PecasGrid } from "./PecasGrid";
import { useAuth } from "../../context/AuthContext";

export function CatalogoTab({ pecas, pecasFiltradas, busca, setBusca, addPeca, removePeca }) {
  const { isAdmin } = useAuth();
  // "Peças cadastradas" é a visão padrão ao entrar — mostra logo tudo
  // que já foi cadastrado até agora, sem precisar rolar a tela.
  const [secaoAtiva, setSecaoAtiva] = useState("lista");

  return (
    <>
      <div className="ptk-tabs">
        <button
          className={`ptk-tab ${secaoAtiva === "lista" ? "active" : ""}`}
          onClick={() => setSecaoAtiva("lista")}
        >
          <BookOpen size={15} /> Peças cadastradas
        </button>
        {isAdmin && (
          <button
            className={`ptk-tab ${secaoAtiva === "cadastrar" ? "active" : ""}`}
            onClick={() => setSecaoAtiva("cadastrar")}
          >
            <PlusCircle size={15} /> Cadastrar peça
          </button>
        )}
      </div>

      {secaoAtiva === "cadastrar" && isAdmin && <CadastrarPecaForm onAdd={addPeca} />}

      {secaoAtiva === "lista" && (
        <>
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
      )}
    </>
  );
}
