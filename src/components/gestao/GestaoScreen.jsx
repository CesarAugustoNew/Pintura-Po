import { useMemo, useState } from "react";
import { Header } from "../layout/Header";
import { PeriodoFilter } from "./PeriodoFilter";
import { ResumoPorTurno } from "./ResumoPorTurno";
import { useLancamentos } from "../../hooks/useLancamentos";
import { useOrdensProducao } from "../../hooks/useOrdensProducao";
import { useParadas } from "../../hooks/useParadas";
import { useSobras } from "../../hooks/useSobras";
import { filtrarPorPeriodo, calcularResumoPorTurno, formatarMinutos } from "../../utils/gestao";

export function GestaoScreen({ onTrocarModulo }) {
  const today = useMemo(() => new Date(), []);

  // Módulo só de leitura: usa os mesmos hooks das outras telas, só que
  // aqui nada é criado/editado — servem só pra puxar os dados já
  // existentes e cruzar num relatório.
  const lancamentos = useLancamentos();
  const ordens = useOrdensProducao(lancamentos.entries);
  const paradas = useParadas();
  const sobras = useSobras();

  const [periodo, setPeriodo] = useState(null);

  const carregando = lancamentos.loading || ordens.loading || paradas.loading || sobras.loading;

  const { resumosPorTurno, totalSobrasPeriodo, totalPecasPeriodo, totalMinutosParadoPeriodo } = useMemo(() => {
    if (!periodo) {
      return { resumosPorTurno: [], totalSobrasPeriodo: 0, totalPecasPeriodo: 0, totalMinutosParadoPeriodo: 0 };
    }

    const dadosFiltrados = {
      lancamentos: filtrarPorPeriodo(lancamentos.entries, periodo.inicio, periodo.fim),
      ordens: filtrarPorPeriodo(ordens.ordens, periodo.inicio, periodo.fim),
      paradas: filtrarPorPeriodo(paradas.paradas, periodo.inicio, periodo.fim),
    };
    const sobrasFiltradas = filtrarPorPeriodo(sobras.sobras, periodo.inicio, periodo.fim);

    const resumosPorTurno = calcularResumoPorTurno(dadosFiltrados);
    const totalPecasPeriodo = resumosPorTurno.reduce((s, r) => s + r.totalPecas, 0);
    const totalMinutosParadoPeriodo = resumosPorTurno.reduce((s, r) => s + r.totalMinutosParado, 0);
    const totalSobrasPeriodo = sobrasFiltradas.reduce((s, sb) => s + sb.quantidade, 0);

    return { resumosPorTurno, totalSobrasPeriodo, totalPecasPeriodo, totalMinutosParadoPeriodo };
  }, [periodo, lancamentos.entries, ordens.ordens, paradas.paradas, sobras.sobras]);

  return (
    <div className="ptk-wrap">
      <div className="ptk-container">
        <Header
          today={today}
          subtitulo="Relatórios de resultado dos turnos, filtrados por dia, mês ou semestre."
          onTrocarModulo={onTrocarModulo}
        />

        <PeriodoFilter onChange={setPeriodo} />

        {carregando && (
          <div className="ptk-panel">
            <p className="ptk-sub" style={{ margin: 0 }}>Carregando dados...</p>
          </div>
        )}

        {!carregando && periodo && (
          <>
            <div className="ptk-stats-grid">
              <div className="ptk-stat">
                <div className="ptk-stat-label">Total de peças no período</div>
                <div className="ptk-stat-value">{totalPecasPeriodo}</div>
              </div>
              <div className="ptk-stat">
                <div className="ptk-stat-label">Tempo parado no período</div>
                <div className="ptk-stat-value" style={{ color: totalMinutosParadoPeriodo > 0 ? "var(--danger)" : "var(--accent)" }}>
                  {totalMinutosParadoPeriodo > 0 ? formatarMinutos(totalMinutosParadoPeriodo) : "0min"}
                </div>
              </div>
              <div className="ptk-stat">
                <div className="ptk-stat-label">Sobras no período</div>
                <div className="ptk-stat-value">{totalSobrasPeriodo}</div>
              </div>
            </div>

            <ResumoPorTurno resumos={resumosPorTurno} />
          </>
        )}
      </div>
    </div>
  );
}
