export type SystemRole = "ADMIN" | "USER";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  systemRole: SystemRole;
  status: "ACTIVE" | "INACTIVE";
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}
