import { TURNOS } from "../constants";

function paraMinutos(horario) {
  if (!horario) return null;
  const [h, m] = horario.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

function dentroDoTurno(minutos, turno) {
  // Turnos "normais" não cruzam a meia-noite (início < fim). O 3º turno
  // cruza (22:30 até 06:00), então o intervalo "dá a volta".
  if (turno.inicioMin < turno.fimMin) {
    return minutos >= turno.inicioMin && minutos < turno.fimMin;
  }
  return minutos >= turno.inicioMin || minutos < turno.fimMin;
}

/** Descobre a qual turno um horário "HH:MM" pertence. Retorna `null` se o horário estiver vazio/inválido. */
export function getTurnoPorHorario(horario) {
  const minutos = paraMinutos(horario);
  if (minutos === null) return null;
  const turno = TURNOS.find((t) => dentroDoTurno(minutos, t));
  return turno ? turno.id : null;
}

/** Turno correspondente ao horário atual do sistema — usado como padrão ao abrir o app. */
export function getTurnoAtual(agora = new Date()) {
  const minutos = agora.getHours() * 60 + agora.getMinutes();
  const turno = TURNOS.find((t) => dentroDoTurno(minutos, t));
  return turno ? turno.id : TURNOS[0].id;
}

export function getTurno(id) {
  return TURNOS.find((t) => t.id === id) || null;
}

export function getTurnoLabel(id) {
  const turno = getTurno(id);
  return turno ? turno.label : "Sem turno";
}
