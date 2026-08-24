import { apiRequest } from "./http";

export const listLancamentos = () => apiRequest("/api/lancamentos");
export const createLancamento = (data) => apiRequest("/api/lancamentos", { method: "POST", body: data });
export const updateLancamento = (id, data) => apiRequest(`/api/lancamentos/${id}`, { method: "PUT", body: data });
export const removeLancamento = (id) => apiRequest(`/api/lancamentos/${id}`, { method: "DELETE" });
