import { apiRequest } from "./http";

export const listParadas = () => apiRequest("/api/paradas");
export const createParada = (data) => apiRequest("/api/paradas", { method: "POST", body: data });
export const updateParada = (id, data) => apiRequest(`/api/paradas/${id}`, { method: "PUT", body: data });
export const removeParada = (id) => apiRequest(`/api/paradas/${id}`, { method: "DELETE" });
