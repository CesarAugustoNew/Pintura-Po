import { useState } from "react";
import { ImagePlus, Package, X } from "lucide-react";
import { useConfirm } from "../common/ConfirmDialogProvider";

export function PecaCard({ peca, onRemove }) {
  const confirm = useConfirm();
  const imagens = peca.imagens || [];
  const [activeIndex, setActiveIndex] = useState(0);

  async function handleRemove() {
    const ok = await confirm({
      title: "Remover peça do catálogo?",
      message: `A peça ${peca.codigo} e sua embalagem cadastrada serão removidas. Essa ação não pode ser desfeita.`,
    });
    if (ok) onRemove(peca.id);
  }

  return (
    <div className="ptk-card">
      <div className="ptk-card-img">
        {imagens.length > 0 ? (
          <img src={imagens[activeIndex] || imagens[0]} alt={peca.codigo} />
        ) : (
          <ImagePlus size={26} />
        )}
      </div>
      {imagens.length > 1 && (
        <div className="ptk-card-thumbs">
          {imagens.map((src, i) => (
            <button
              key={i}
              type="button"
              className={`ptk-card-thumb${i === activeIndex ? " is-active" : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
      <div className="ptk-card-body">
        <div className="ptk-card-codigo ptk-mono">{peca.codigo}</div>
        {(peca.cliente || peca.composicao) && (
          <div className="ptk-card-meta">
            {[peca.cliente, peca.composicao].filter(Boolean).join(" · ")}
          </div>
        )}
        {peca.descricao && <div className="ptk-card-desc">{peca.descricao}</div>}
        {(peca.caixa || peca.qtdPorCaixa) && (
          <div className="ptk-embalagem-badge">
            <Package size={12} />
            {peca.caixa || "Caixa não informada"}
            {peca.qtdPorCaixa ? ` · ${peca.qtdPorCaixa}/caixa` : ""}
          </div>
        )}
      </div>
      <div className="ptk-card-footer">
        <button className="ptk-remove" onClick={handleRemove} aria-label="Remover peça">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
