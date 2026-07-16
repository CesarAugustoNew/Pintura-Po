import { FUROS_POR_BARRA } from "../../constants";

/**
 * Representa visualmente os furos de uma barra, preenchendo `filled` deles.
 * Usado tanto no formulário (prévia) quanto na tabela e nos cards.
 */
export function BarPegs({ filled, size = "md" }) {
  const dims = size === "sm" ? "6px" : "10px";
  const gap = size === "sm" ? "3px" : "5px";

  return (
    <div style={{ display: "flex", gap, alignItems: "center" }}>
      {Array.from({ length: FUROS_POR_BARRA }).map((_, i) => (
        <span
          key={i}
          style={{
            width: dims,
            height: dims,
            borderRadius: "50%",
            background: i < filled ? "var(--accent)" : "var(--line)",
            boxShadow: i < filled ? "0 0 0 1px rgba(226,161,58,0.35)" : "none",
            transition: "background 0.2s ease",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}
