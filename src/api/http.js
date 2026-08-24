const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const TOKEN_KEY = "pintura_po_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/**
 * Chamado quando uma requisição volta com 401 (token ausente/expirado).
 * O AuthProvider registra aqui a função que desloga o usuário, pra
 * qualquer chamada da API poder acionar o logout automaticamente.
 */
let onUnauthorized = () => {};
export function setOnUnauthorized(fn) {
  onUnauthorized = fn;
}

/**
 * Faz uma requisição à API já com o header de autenticação (quando
 * existir token salvo) e trata erros de forma consistente: em caso de
 * erro, lança uma Error com a mensagem vinda da API (ou uma mensagem
 * genérica), pra quem chamar poder fazer `catch (e) { setErro(e.message) }`.
 */
export async function apiRequest(path, { method = "GET", body, ...options } = {}) {
  const token = getToken();

  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    });
  } catch (networkError) {
    throw new Error("Não foi possível conectar à API. Verifique sua conexão ou tente novamente.");
  }

  if (response.status === 401) {
    onUnauthorized();
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (response.status === 204) return null;

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = data?.message || "Ocorreu um erro inesperado. Tente novamente.";
    throw new Error(message);
  }

  return data;
}
