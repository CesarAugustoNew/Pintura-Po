import { useState } from "react";
import { LogIn, Lock, User, PaintBucket } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login.css";

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
    <div className="login-page">
      <div className="login-page__blob login-page__blob--1" />
      <div className="login-page__blob login-page__blob--2" />
      <div className="login-page__blob login-page__blob--3" />

      <div className="login-card">
        {/* Lado azul: identidade da marca */}
        <div className="login-card__brand">
          <div className="login-card__logo">
            <div className="login-card__logo-icon">
              <PaintBucket size={20} />
            </div>
            <span className="login-card__logo-text">Grupo Delga</span>
          </div>

          <div className="login-card__welcome">
            <h1>Bem-vindo(a)!</h1>
            <p>
              Setor de Pintura · Controle de Barras e Embalagem. Entre com sua conta para
              registrar lançamentos, ordens de produção e acompanhar o dia a dia da produção.
            </p>
          </div>
        </div>

        {/* Lado branco: formulário */}
        <form className="login-card__form-side" onSubmit={handleSubmit}>
          <div className="login-card__form-title">Entrar na conta</div>
          <div className="login-card__form-sub">Informe seu usuário e senha para continuar.</div>

          <div className="login-field">
            <label className="login-field__label">Usuário</label>
            <div className="login-field__wrap">
              <User size={16} className="login-field__icon" />
              <input
                className="login-field__input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: operador"
                autoFocus
                autoComplete="username"
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-field__label">Senha</label>
            <div className="login-field__wrap">
              <Lock size={16} className="login-field__icon" />
              <input
                className="login-field__input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          {loginError && <div className="login-error">{loginError}</div>}

          <button type="submit" className="login-submit" disabled={loginLoading}>
            <LogIn size={16} />
            {loginLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
