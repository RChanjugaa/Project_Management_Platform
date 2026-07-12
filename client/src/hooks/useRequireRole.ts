"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { RoleName } from "@/types/auth";

export function useRequireRole(role: RoleName) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      router.replace("/unauthorized");
    }
  }, [isLoading, role, router, user]);

  return { user, isLoading, isAuthorized: Boolean(user && user.role === role) };
}
