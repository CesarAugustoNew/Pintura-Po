/**
 * Calcula o status de uma ordem de produção comparando quanto já foi
 * produzido (abatido automaticamente pelos lançamentos de mesma peça/lote)
 * com a meta (quantidade) definida no registro.
 *
 * - "pendente": ainda não foi lançada nenhuma peça dessa ordem.
 * - "completo": a quantidade produzida bateu (ou passou) a meta.
 * - "incompleto": já foi produzido algo, mas ainda está abaixo da meta.
 */
export function getStatusOrdem(ordem) {
  const produzida = ordem.quantidadeProduzida || 0;
  if (produzida <= 0) return "pendente";
  return produzida >= ordem.quantidade ? "completo" : "incompleto";
}

export const STATUS_LABELS = {
  pendente: "Pendente",
  completo: "Concluído",
  incompleto: "Em produção",
};
