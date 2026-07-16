export function ResumoDia({ totalPecasDia, totalBarrasDia, porModelo }) {
  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">Resumo do dia</h2>

      <div className="ptk-stats-grid">
        <div className="ptk-stat">
          <div className="ptk-stat-label">Total de peças hoje</div>
          <div className="ptk-stat-value">{totalPecasDia}</div>
        </div>
        <div className="ptk-stat">
          <div className="ptk-stat-label">Barras usadas hoje</div>
          <div className="ptk-stat-value">{totalBarrasDia}</div>
        </div>
        <div className="ptk-stat">
          <div className="ptk-stat-label">Modelos diferentes</div>
          <div className="ptk-stat-value">{porModelo.length}</div>
        </div>
      </div>

      {porModelo.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table className="ptk-table">
            <thead>
              <tr>
                <th>Peça / Modelo</th>
                <th>Lotes</th>
                <th>Barras usadas</th>
                <th>Total de peças</th>
              </tr>
            </thead>
            <tbody>
              {porModelo.map((m) => (
                <tr key={m.peca}>
                  <td className="ptk-mono">{m.peca}</td>
                  <td className="ptk-mono" style={{ color: "var(--muted)" }}>
                    {Array.from(m.lotes).join(", ")}
                  </td>
                  <td className="ptk-mono">{m.barras}</td>
                  <td className="ptk-mono" style={{ color: "var(--accent)" }}>{m.totalPecas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
