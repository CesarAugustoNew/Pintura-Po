import { getTurnoLabel } from "../../utils/turnos";
import { formatarMinutos } from "../../utils/gestao";

export function ResumoPorTurno({ resumos }) {
  const totalGeral = resumos.reduce(
    (acc, r) => ({
      totalPecas: acc.totalPecas + r.totalPecas,
      totalBarras: acc.totalBarras + r.totalBarras,
      qtdLancamentos: acc.qtdLancamentos + r.qtdLancamentos,
      qtdSetups: acc.qtdSetups + r.qtdSetups,
      metaOrdens: acc.metaOrdens + r.metaOrdens,
      produzidoOrdens: acc.produzidoOrdens + r.produzidoOrdens,
      qtdParadas: acc.qtdParadas + r.qtdParadas,
      totalMinutosParado: acc.totalMinutosParado + r.totalMinutosParado,
    }),
    {
      totalPecas: 0,
      totalBarras: 0,
      qtdLancamentos: 0,
      qtdSetups: 0,
      metaOrdens: 0,
      produzidoOrdens: 0,
      qtdParadas: 0,
      totalMinutosParado: 0,
    }
  );
  const atendimentoGeral =
    totalGeral.metaOrdens > 0 ? Math.round((totalGeral.produzidoOrdens / totalGeral.metaOrdens) * 100) : null;

  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">Resultado por turno</h2>

      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <table className="ptk-table">
          <thead>
            <tr>
              <th>Turno</th>
              <th>Peças produzidas</th>
              <th>Barras usadas</th>
              <th>Lançamentos</th>
              <th>Setups</th>
              <th>Meta (ordens)</th>
              <th>Produzido (ordens)</th>
              <th>Atendimento</th>
              <th>Paradas</th>
              <th>Tempo parado</th>
            </tr>
          </thead>
          <tbody>
            {resumos.map((r) => (
              <tr key={r.turnoId}>
                <td>
                  <span className={`ptk-turno-badge ptk-turno-badge--${r.turnoId}`}>{getTurnoLabel(r.turnoId)}</span>
                </td>
                <td className="ptk-mono" style={{ color: "var(--accent)" }}>{r.totalPecas}</td>
                <td className="ptk-mono">{r.totalBarras}</td>
                <td className="ptk-mono">{r.qtdLancamentos}</td>
                <td className="ptk-mono" style={{ color: "var(--muted)" }}>{r.qtdSetups}</td>
                <td className="ptk-mono" style={{ color: "var(--muted)" }}>{r.metaOrdens || "—"}</td>
                <td className="ptk-mono">{r.produzidoOrdens || "—"}</td>
                <td className="ptk-mono">
                  {r.atendimentoOrdens === null ? "—" : `${r.atendimentoOrdens}%`}
                </td>
                <td className="ptk-mono">{r.qtdParadas || "—"}</td>
                <td className="ptk-mono" style={{ color: r.totalMinutosParado > 0 ? "var(--danger)" : "var(--muted)" }}>
                  {r.totalMinutosParado > 0 ? formatarMinutos(r.totalMinutosParado) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: 700 }}>
              <td>Total</td>
              <td className="ptk-mono" style={{ color: "var(--accent)" }}>{totalGeral.totalPecas}</td>
              <td className="ptk-mono">{totalGeral.totalBarras}</td>
              <td className="ptk-mono">{totalGeral.qtdLancamentos}</td>
              <td className="ptk-mono" style={{ color: "var(--muted)" }}>{totalGeral.qtdSetups}</td>
              <td className="ptk-mono" style={{ color: "var(--muted)" }}>{totalGeral.metaOrdens || "—"}</td>
              <td className="ptk-mono">{totalGeral.produzidoOrdens || "—"}</td>
              <td className="ptk-mono">{atendimentoGeral === null ? "—" : `${atendimentoGeral}%`}</td>
              <td className="ptk-mono">{totalGeral.qtdParadas || "—"}</td>
              <td className="ptk-mono" style={{ color: totalGeral.totalMinutosParado > 0 ? "var(--danger)" : "var(--muted)" }}>
                {totalGeral.totalMinutosParado > 0 ? formatarMinutos(totalGeral.totalMinutosParado) : "—"}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
