import { apiRequest } from "@/services/api";
import type { AuthUser, LoginRequest } from "@/types/auth";

export function login(payload: LoginRequest) {
  return apiRequest<{ user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function logout() {
  return apiRequest<null>("/auth/logout", {
    method: "POST"
  });
}

export function getCurrentUser() {
  return apiRequest<{ user: AuthUser }>("/auth/me");
}
