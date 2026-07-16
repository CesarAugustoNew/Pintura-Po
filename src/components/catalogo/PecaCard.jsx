import { ImagePlus, X } from "lucide-react";

export function PecaCard({ peca, onRemove }) {
  return (
    <div className="ptk-card">
      <div className="ptk-card-img">
        {peca.imagem ? <img src={peca.imagem} alt={peca.codigo} /> : <ImagePlus size={26} />}
      </div>
      <div className="ptk-card-body">
        <div className="ptk-card-codigo ptk-mono">{peca.codigo}</div>
        <div className="ptk-card-desc">{peca.descricao}</div>
      </div>
      <div className="ptk-card-footer">
        <button className="ptk-remove" onClick={() => onRemove(peca.id)} aria-label="Remover peça">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
