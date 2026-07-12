import type { RoleName } from "@/types/auth";

export const roleDashboardPath: Record<RoleName, string> = {
  ADMIN: "/admin/dashboard",
  PROJECT_MANAGER: "/manager/dashboard",
  TEAM_MEMBER: "/member/dashboard"
};
