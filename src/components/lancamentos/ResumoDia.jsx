import { FileSpreadsheet } from "lucide-react";
import { exportarLancamentosExcel } from "../../utils/exportExcel";

export function ResumoDia({ entries, totalPecasDia, totalBarrasDia, porModelo }) {
  function handleExport() {
    exportarLancamentosExcel({
      entries,
      totalPecasDia,
      totalBarrasDia,
      porModelo,
      today: new Date(),
    });
  }

  return (
    <div className="ptk-panel">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <h2 className="ptk-panel-title" style={{ margin: 0 }}>
          Resumo do dia
        </h2>
        <button className="ptk-btn" onClick={handleExport}>
          <FileSpreadsheet size={16} /> Exportar Excel
        </button>
      </div>

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
