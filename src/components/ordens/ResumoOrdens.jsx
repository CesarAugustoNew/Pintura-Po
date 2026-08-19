export function ResumoOrdens({
  titulo = "Resumo da ordem do dia",
  totalOrdens,
  totalPrioridades,
  totalMeta,
  totalProduzido,
}) {
  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">{titulo}</h2>

      <div className="ptk-stats-grid">
        <div className="ptk-stat">
          <div className="ptk-stat-label">Peças/lotes na ordem</div>
          <div className="ptk-stat-value">{totalOrdens}</div>
        </div>
        <div className="ptk-stat">
          <div className="ptk-stat-label">Marcadas como prioridade</div>
          <div className="ptk-stat-value">{totalPrioridades}</div>
        </div>
        <div className="ptk-stat">
          <div className="ptk-stat-label">Meta (peças)</div>
          <div className="ptk-stat-value">{totalMeta}</div>
        </div>
        <div className="ptk-stat">
          <div className="ptk-stat-label">Produzido até agora</div>
          <div className="ptk-stat-value">{totalProduzido}</div>
        </div>
      </div>
    </div>
  );
}
