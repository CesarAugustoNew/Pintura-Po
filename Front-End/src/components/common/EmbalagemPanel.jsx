import { Package } from "lucide-react";

/**
 * Mostra, para as peças já lançadas/registradas no dia, como cada uma
 * deve ser embalada (caixa e quantidade por caixa), buscando essa
 * informação no catálogo de peças cadastrado na aba "Cadastro de peças".
 */
export function EmbalagemPanel({ codigos, catalogoPecas }) {
  const unicos = Array.from(new Set(codigos.map((c) => c.trim()).filter(Boolean)));

  function buscarNoCatalogo(codigo) {
    return catalogoPecas.find((p) => p.codigo.toLowerCase() === codigo.toLowerCase());
  }

  return (
    <div className="ptk-panel">
      <h2 className="ptk-panel-title">
        <Package size={16} color="var(--accent-2)" /> Embalagem
      </h2>

      {unicos.length === 0 ? (
        <div className="ptk-empty">
          Assim que houver peças aqui, a embalagem cadastrada para cada uma aparece nesta lista.
        </div>
      ) : (
        <div style={{ overflowX: "auto", maxWidth: "100%" }}>
          <table className="ptk-table">
            <thead>
              <tr>
                <th>Peça</th>
                <th>Caixa</th>
                <th>Qtd por caixa</th>
              </tr>
            </thead>
            <tbody>
              {unicos.map((codigo) => {
                const peca = buscarNoCatalogo(codigo);
                return (
                  <tr key={codigo}>
                    <td className="ptk-mono">{codigo}</td>
                    {peca && (peca.caixa || peca.qtdPorCaixa) ? (
                      <>
                        <td className="ptk-mono">{peca.caixa || "—"}</td>
                        <td className="ptk-mono" style={{ color: "var(--accent)" }}>
                          {peca.qtdPorCaixa || "—"}
                        </td>
                      </>
                    ) : (
                      <td colSpan={2} style={{ color: "var(--muted)" }}>
                        {peca ? "Embalagem não cadastrada para essa peça." : "Peça não cadastrada no catálogo."}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
