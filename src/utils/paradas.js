/**
 * Calcula a duração em minutos entre dois horários no formato "HH:MM".
 * Se o horário de fim for menor que o de início, assume que a parada
 * atravessou a meia-noite.
 */
export function calcularDuracaoMinutos(horaInicio, horaFim) {
  const [hi, mi] = horaInicio.split(":").map(Number);
  const [hf, mf] = horaFim.split(":").map(Number);
  if ([hi, mi, hf, mf].some((n) => isNaN(n))) return null;

  const minutosInicio = hi * 60 + mi;
  let minutosFim = hf * 60 + mf;
  if (minutosFim < minutosInicio) minutosFim += 24 * 60;

  return minutosFim - minutosInicio;
}

/** Formata minutos como "1h 20min", "45 min" ou "2h". */
export function formatDuracao(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
