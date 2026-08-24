import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginApi } from "../api/auth";
import { getToken, setToken, setOnUnauthorized } from "../api/http";

const AuthContext = createContext(null);

const USER_KEY = "pintura_po_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [initializing, setInitializing] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Se não houver token salvo, não tem sessão pra restaurar.
  useEffect(() => {
    if (!getToken()) setUser(null);
    setInitializing(false);
  }, []);

  // Qualquer chamada de API que receber 401 aciona este logout,
  // sem precisar cada hook saber sobre autenticação.
  useEffect(() => {
    setOnUnauthorized(() => {
      setToken(null);
      localStorage.removeItem(USER_KEY);
      setUser(null);
    });
  }, []);

  async function login(username, password) {
    setLoginLoading(true);
    setLoginError("");
    try {
      const response = await loginApi(username, password);
      setToken(response.token);
      const nextUser = { username: response.username, nome: response.nome, role: response.role };
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      return { ok: true };
    } catch (e) {
      setLoginError(e.message);
      return { ok: false, error: e.message };
    } finally {
      setLoginLoading(false);
    }
  }

  function logout() {
    setToken(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "ADMIN",
      initializing,
      login,
      loginLoading,
      loginError,
      logout,
    }),
    [user, initializing, loginLoading, loginError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa ser usado dentro de um AuthProvider.");
  return ctx;
}
