import { apiRequest } from "./http";

export const listOrdens = () => apiRequest("/api/ordens");
export const createOrdem = (data) => apiRequest("/api/ordens", { method: "POST", body: data });
export const updateOrdem = (id, data) => apiRequest(`/api/ordens/${id}`, { method: "PUT", body: data });
export const removeOrdem = (id) => apiRequest(`/api/ordens/${id}`, { method: "DELETE" });
