import { getTurno } from "../../utils/turnos";

/** Selo colorido pequeno mostrando o turno de um lançamento/ordem numa linha de tabela. */
export function TurnoBadge({ turno }) {
  const info = getTurno(turno);
  if (!info) return <span style={{ color: "var(--muted)" }}>—</span>;
  return <span className={`ptk-turno-badge ptk-turno-badge--${info.id}`}>{info.numero}º</span>;
}
