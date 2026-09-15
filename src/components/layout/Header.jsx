import { LogOut, PaintBucket } from "lucide-react";
import { FUROS_POR_BARRA } from "../../constants";
import { formatDatePtBr } from "../../utils/date";
import { useAuth } from "../../context/AuthContext";

export function Header({ today }) {
  const { user, logout } = useAuth();

  return (
    <div className="ptk-header">
      <div>
        <div className="ptk-eyebrow">Setor de Pintura · Controle de Barras e Embalagem</div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              background: "var(--accent)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PaintBucket size={18} />
          </div>
          <h1 className="ptk-title" style={{ margin: 0 }}>
            Grupo Delga
          </h1>
        </div>
        <p className="ptk-sub">
          Cada barra tem {FUROS_POR_BARRA} furos. Registre o lote, quantas peças foram por barra e o
          intervalo de barras usado.
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {user && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>{user.nome}</div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>
              {user.role === "ADMIN" ? "Administrador" : "Operador"}
            </div>
          </div>
        )}
        <button
          className="ptk-btn-secondary"
          onClick={logout}
          title="Sair"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <LogOut size={14} /> Sair
        </button>
        <div className="ptk-daycard">
          <div className="ptk-daycard-label">Hoje</div>
          <div className="ptk-daycard-date">{formatDatePtBr(today)}</div>
        </div>
      </div>
    </div>
  );
}
