import { PaintBucket, Trash2 } from "lucide-react";
import { BarPegs } from "../common/BarPegs";

export function LancamentosTable({ entries, onRemove }) {
  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">
        <PaintBucket size={16} color="var(--accent-2)" /> Lançamentos de hoje
      </h2>

      {entries.length === 0 ? (
        <div className="ptk-empty">Nenhum lançamento ainda. Adicione o primeiro lote acima.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="ptk-table">
            <thead>
              <tr>
                <th>Peça</th>
                <th>Lote</th>
                <th>Qtd/barra</th>
                <th>Barras</th>
                <th>Total peças</th>
                <th>Ocupação</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className="ptk-mono">{e.peca}</td>
                  <td className="ptk-mono">{e.lote}</td>
                  <td className="ptk-mono">{e.qtdPorBarra}</td>
                  <td className="ptk-mono">
                    {e.barraInicial}–{e.barraFinal} <span style={{ color: "var(--muted)" }}>({e.barrasUsadas})</span>
                    {e.overlapWarning && <div className="ptk-warn">confere: barra repetida no dia</div>}
                  </td>
                  <td className="ptk-mono" style={{ color: "var(--accent)" }}>{e.totalPecas}</td>
                  <td>
                    <BarPegs filled={e.qtdPorBarra} size="sm" />
                  </td>
                  <td>
                    <button className="ptk-remove" onClick={() => onRemove(e.id)} aria-label="Remover lançamento">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
