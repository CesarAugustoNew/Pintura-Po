export const FUROS_POR_BARRA = 10;
export const TOTAL_BARRAS = 49;

/**
 * Os 3 turnos da Delga. `inicioMin`/`fimMin` são minutos desde 00:00.
 * O 3º turno atravessa a meia-noite (começa às 22:30 e vai até 06:00do
 * dia seguinte) — isso é tratado nas funções de src/utils/turnos.js.
 */
export const TURNOS = [
  { id: "turno1", numero: 1, label: "1º Turno", horario: "06:00–14:00", inicioMin: 6 * 60, fimMin: 14 * 60 },
  { id: "turno2", numero: 2, label: "2º Turno", horario: "14:00–22:30", inicioMin: 14 * 60, fimMin: 22 * 60 + 30 },
  { id: "turno3", numero: 3, label: "3º Turno", horario: "22:30–06:00", inicioMin: 22 * 60 + 30, fimMin: 6 * 60 },
];

export const TURNO_TODOS = "todos";
