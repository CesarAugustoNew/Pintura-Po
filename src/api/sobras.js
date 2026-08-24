import { apiRequest } from "./http";

export const listSobras = () => apiRequest("/api/sobras");
export const createSobra = (data) => apiRequest("/api/sobras", { method: "POST", body: data });
export const updateSobra = (id, data) => apiRequest(`/api/sobras/${id}`, { method: "PUT", body: data });
export const removeSobra = (id) => apiRequest(`/api/sobras/${id}`, { method: "DELETE" });
