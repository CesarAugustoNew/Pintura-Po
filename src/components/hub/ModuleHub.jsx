import { PaintBucket, Droplets, BarChart3, BookOpen, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MODULOS = [
  {
    id: "pintura-po",
    label: "Pintura PO",
    descricao: "Lançamentos, ordens de produção, sobras e paradas do setor de pintura.",
    icon: PaintBucket,
    disponivel: true,
  },
  {
    id: "ktl",
    label: "KTL",
    descricao: "Em breve.",
    icon: Droplets,
    disponivel: false,
  },
  {
    id: "gestao",
    label: "Gestão",
    descricao: "Em breve.",
    icon: BarChart3,
    disponivel: false,
  },
  {
    id: "catalogo",
    label: "Cadastro de Peças",
    descricao: "Catálogo de peças, com embalagem, cliente e composição.",
    icon: BookOpen,
    disponivel: true,
  },
];

export function ModuleHub({ onSelect }) {
  const { user, logout } = useAuth();

  return (
    <div className="ptk-wrap">
      <div className="ptk-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <div>
            <div className="ptk-eyebrow">Grupo Delga</div>
            <h1 className="ptk-title" style={{ marginBottom: "4px" }}>
              O que você quer acessar?
            </h1>
            {user && (
              <p className="ptk-sub" style={{ margin: 0 }}>
                Olá, {user.nome}. Escolha um módulo para continuar.
              </p>
            )}
          </div>
          <button
            className="ptk-btn-secondary"
            onClick={logout}
            title="Sair"
            style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}
          >
            <LogOut size={14} /> Sair
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {MODULOS.map(({ id, label, descricao, icon: Icon, disponivel }) => (
            <button
              key={id}
              onClick={() => disponivel && onSelect(id)}
              className="ptk-panel"
              disabled={!disponivel}
              style={{
                textAlign: "left",
                cursor: disponivel ? "pointer" : "not-allowed",
                opacity: disponivel ? 1 : 0.55,
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                border: "1px solid var(--line)",
                marginBottom: 0,
                transition: "transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease",
              }}
              onMouseEnter={(e) => {
                if (!disponivel) return;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 24px rgba(28, 86, 214, 0.14)";
                e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "var(--line)";
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: disponivel ? "var(--accent)" : "var(--muted)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={22} />
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>{label}</div>
                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.4 }}>{descricao}</div>
              </div>

              {disponivel ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--accent)",
                    marginTop: "auto",
                  }}
                >
                  Acessar <ArrowRight size={14} />
                </div>
              ) : (
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginTop: "auto" }}>
                  Indisponível por enquanto
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
