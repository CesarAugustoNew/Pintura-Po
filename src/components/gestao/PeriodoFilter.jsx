import { useEffect, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { getIntervaloDia, getIntervaloMes, getIntervaloSemestre } from "../../utils/gestao";

function hojeISO() {
  const hoje = new Date();
  const y = hoje.getFullYear();
  const m = String(hoje.getMonth() + 1).padStart(2, "0");
  const d = String(hoje.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function mesAtualISO() {
  return hojeISO().slice(0, 7);
}

const TIPOS = [
  { id: "dia", label: "Dia" },
  { id: "mes", label: "Mês" },
  { id: "semestre", label: "Semestre" },
];

/**
 * Deixa a pessoa escolher o período do relatório (um dia específico,
 * um mês, ou um semestre inteiro) e devolve pra quem usa já o
 * intervalo calculado (onChange({ inicio, fim, label })).
 */
export function PeriodoFilter({ onChange }) {
  const [tipo, setTipo] = useState("dia");
  const [dia, setDia] = useState(hojeISO());
  const [mes, setMes] = useState(mesAtualISO());
  const anoAtual = new Date().getFullYear();
  const [ano, setAno] = useState(anoAtual);
  const [semestre, setSemestre] = useState(new Date().getMonth() < 6 ? 1 : 2);

  const { inicio, fim, label } = useMemo(() => {
    if (tipo === "dia") {
      const { inicio, fim } = getIntervaloDia(dia);
      return { inicio, fim, label: inicio.toLocaleDateString("pt-BR") };
    }
    if (tipo === "mes") {
      const { inicio, fim } = getIntervaloMes(mes);
      const label = inicio.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      return { inicio, fim, label: label.charAt(0).toUpperCase() + label.slice(1) };
    }
    const { inicio, fim } = getIntervaloSemestre(ano, semestre);
    return { inicio, fim, label: `${semestre}º semestre de ${ano}` };
  }, [tipo, dia, mes, ano, semestre]);

  // Só notifica quem usa quando o intervalo calculado muda de verdade.
  useEffect(() => {
    onChange({ inicio, fim, label });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inicio.getTime(), fim.getTime()]);

  return (
    <div className="ptk-panel" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px" }}>
      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "13px" }}>
        <CalendarDays size={15} /> Período
      </span>

      <div className="ptk-tabs" style={{ margin: 0 }}>
        {TIPOS.map((t) => (
          <button
            key={t.id}
            className={`ptk-tab ${tipo === t.id ? "active" : ""}`}
            onClick={() => setTipo(t.id)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      {tipo === "dia" && (
        <input
          type="date"
          className="ptk-input"
          style={{ width: "auto" }}
          value={dia}
          onChange={(e) => setDia(e.target.value)}
        />
      )}

      {tipo === "mes" && (
        <input
          type="month"
          className="ptk-input"
          style={{ width: "auto" }}
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        />
      )}

      {tipo === "semestre" && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <select className="ptk-input" style={{ width: "auto" }} value={semestre} onChange={(e) => setSemestre(Number(e.target.value))}>
            <option value={1}>1º semestre (Jan–Jun)</option>
            <option value={2}>2º semestre (Jul–Dez)</option>
          </select>
          <input
            type="number"
            className="ptk-input"
            style={{ width: "90px" }}
            value={ano}
            onChange={(e) => setAno(Number(e.target.value) || anoAtual)}
          />
        </div>
      )}

      <span style={{ marginLeft: "auto", fontSize: "13px", color: "var(--muted)" }}>
        Exibindo: <strong style={{ color: "var(--text)" }}>{label}</strong>
      </span>
    </div>
  );
}
