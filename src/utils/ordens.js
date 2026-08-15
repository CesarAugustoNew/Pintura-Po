/**
 * Calcula o status de envio de uma ordem de produção comparando a
 * quantidade enviada com a meta (quantidade) definida no registro.
 *
 * - "pendente": ainda não foi registrado nenhum envio.
 * - "completo": a quantidade enviada bateu (ou passou) a meta.
 * - "incompleto": foi enviado algo, mas ficou abaixo da meta.
 */
export function getStatusOrdem(ordem) {
  if (ordem.quantidadeEnviada === null || ordem.quantidadeEnviada === undefined) {
    return "pendente";
  }
  return ordem.quantidadeEnviada >= ordem.quantidade ? "completo" : "incompleto";
}

export const STATUS_LABELS = {
  pendente: "Pendente",
  completo: "Concluído",
  incompleto: "Incompleto",
};
