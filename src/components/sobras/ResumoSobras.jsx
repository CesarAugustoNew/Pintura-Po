export function ResumoSobras({ totalSobras, totalRegistros }) {
  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">Resumo de sobras</h2>

      <div className="ptk-stats-grid">
        <div className="ptk-stat">
          <div className="ptk-stat-label">Total de peças em sobra</div>
          <div className="ptk-stat-value">{totalSobras}</div>
        </div>
        <div className="ptk-stat">
          <div className="ptk-stat-label">Registros de sobra</div>
          <div className="ptk-stat-value">{totalRegistros}</div>
        </div>
      </div>
    </div>
  );
}
