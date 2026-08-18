import { BookOpen, Search } from "lucide-react";
import { PecaCard } from "./PecaCard";

export function PecasGrid({ pecas, pecasFiltradas, busca, onBuscaChange, onRemove }) {
  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">
        <BookOpen size={16} color="var(--accent-2)" /> Peças cadastradas
      </h2>

      <div className="ptk-search">
        <Search size={15} />
        <input
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder="Buscar por código ou descrição..."
        />
      </div>

      {pecas.length === 0 ? (
        <div className="ptk-empty">Nenhuma peça cadastrada ainda. Cadastre a primeira acima.</div>
      ) : pecasFiltradas.length === 0 ? (
        <div className="ptk-empty">Nenhuma peça encontrada para "{busca}".</div>
      ) : (
        <div className="ptk-grid">
          {pecasFiltradas.map((p) => (
            <PecaCard key={p.id} peca={p} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
