import { formatDuracao } from "../../utils/paradas";

export function ResumoParadas({ totalMinutosParado, totalRegistros }) {
  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">Resumo de paradas</h2>

      <div className="ptk-stats-grid">
        <div className="ptk-stat">
          <div className="ptk-stat-label">Tempo total parado</div>
          <div className="ptk-stat-value">
            {totalMinutosParado > 0 ? formatDuracao(totalMinutosParado) : "0 min"}
          </div>
        </div>
        <div className="ptk-stat">
          <div className="ptk-stat-label">Paradas registradas</div>
          <div className="ptk-stat-value">{totalRegistros}</div>
        </div>
      </div>
    </div>
  );
}
