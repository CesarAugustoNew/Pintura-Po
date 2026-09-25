import { useMemo } from "react";
import { Construction } from "lucide-react";
import { Header } from "../layout/Header";

export function EmBreveScreen({ titulo, onTrocarModulo }) {
  const today = useMemo(() => new Date(), []);

  return (
    <div className="ptk-wrap">
      <div className="ptk-container">
        <Header today={today} subtitulo={`Módulo ${titulo}`} onTrocarModulo={onTrocarModulo} />

        <div
          className="ptk-panel"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "60px 24px",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "var(--panel-2)",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Construction size={26} />
          </div>
          <h2 style={{ margin: 0, fontSize: "18px" }}>{titulo} ainda está em construção</h2>
          <p className="ptk-sub" style={{ margin: 0, maxWidth: "380px" }}>
            Esse módulo ainda não tem funcionalidades definidas. Assim que for construído, vai aparecer
            aqui.
          </p>
        </div>
      </div>
    </div>
  );
}
