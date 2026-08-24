import { apiRequest } from "./http";

export const listPecas = (busca) => apiRequest(`/api/pecas${busca ? `?busca=${encodeURIComponent(busca)}` : ""}`);
export const createPeca = (data) => apiRequest("/api/pecas", { method: "POST", body: data });
export const removePeca = (id) => apiRequest(`/api/pecas/${id}`, { method: "DELETE" });
