"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { SystemRole } from "@/types/auth";

export function useRequireRole(role?: SystemRole) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (role && user.systemRole !== role) {
      router.replace("/unauthorized");
    }
  }, [isLoading, role, router, user]);

  return { user, isLoading, isAuthorized: Boolean(user && (!role || user.systemRole === role)) };
}
