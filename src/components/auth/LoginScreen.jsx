import { useState } from "react";
import { LogIn, Lock, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function LoginScreen() {
  const { login, loginLoading, loginError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password) return;
    login(username.trim(), password);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "16px",
      }}
    >
      <form onSubmit={handleSubmit} className="ptk-panel" style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <div className="ptk-eyebrow">Setor de Pintura · Controle de Barras e Embalagem</div>
          <h1 className="ptk-title" style={{ fontSize: "22px" }}>
            Grupo Delga
          </h1>
          <p className="ptk-sub">Entre com seu usuário e senha para continuar.</p>
        </div>

        <div style={{ marginTop: "20px" }}>
          <label className="ptk-label">Usuário</label>
          <div style={{ position: "relative" }}>
            <User
              size={16}
              color="var(--muted)"
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              className="ptk-input"
              style={{ paddingLeft: "34px" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: operador"
              autoFocus
              autoComplete="username"
            />
          </div>
        </div>

        <div style={{ marginTop: "14px" }}>
          <label className="ptk-label">Senha</label>
          <div style={{ position: "relative" }}>
            <Lock
              size={16}
              color="var(--muted)"
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              className="ptk-input"
              style={{ paddingLeft: "34px" }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
        </div>

        {loginError && (
          <div className="ptk-error" style={{ marginTop: "14px" }}>
            {loginError}
          </div>
        )}

        <button
          type="submit"
          className="ptk-btn"
          style={{ width: "100%", justifyContent: "center", marginTop: "20px" }}
          disabled={loginLoading}
        >
          <LogIn size={16} />
          {loginLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
