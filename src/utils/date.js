export function formatDatePtBr(date) {
  return date
    .toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })
    .replace(/^\w/, (c) => c.toUpperCase());
}

/** Formata a data só com números, no padrão brasileiro (ex: 21/08/2026). */
export function formatDateNumeric(date) {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
