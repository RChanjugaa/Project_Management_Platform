export type RoleName = "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: RoleName;
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
