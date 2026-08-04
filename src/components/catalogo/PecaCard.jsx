import { ImagePlus, Package, X } from "lucide-react";

export function PecaCard({ peca, onRemove }) {
  return (
    <div className="ptk-card">
      <div className="ptk-card-img">
        {peca.imagem ? <img src={peca.imagem} alt={peca.codigo} /> : <ImagePlus size={26} />}
      </div>
      <div className="ptk-card-body">
        <div className="ptk-card-codigo ptk-mono">{peca.codigo}</div>
        <div className="ptk-card-desc">{peca.descricao}</div>
        {(peca.caixa || peca.qtdPorCaixa) && (
          <div className="ptk-embalagem-badge">
            <Package size={12} />
            {peca.caixa || "Caixa não informada"}
            {peca.qtdPorCaixa ? ` · ${peca.qtdPorCaixa}/caixa` : ""}
          </div>
        )}
      </div>
      <div className="ptk-card-footer">
        <button className="ptk-remove" onClick={() => onRemove(peca.id)} aria-label="Remover peça">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
