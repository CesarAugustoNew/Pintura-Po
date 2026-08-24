import { apiRequest } from "./http";

export function login(username, password) {
  return apiRequest("/api/auth/login", { method: "POST", body: { username, password } });
}
