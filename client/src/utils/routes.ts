import type { SystemRole } from "@/types/auth";

export const roleDashboardPath: Record<SystemRole, string> = {
  ADMIN: "/admin/dashboard",
  USER: "/dashboard"
};
