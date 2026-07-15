"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useRequireRole } from "@/hooks/useRequireRole";
import type { RoleName } from "@/types/auth";

export function DashboardLayout({ role, title, children }: { role: RoleName; title: string; children: React.ReactNode }) {
  const { isLoading, isAuthorized } = useRequireRole(role);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <LoadingSpinner label="Checking your access" />
      </main>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] md:flex">
      <Sidebar role={role} />
      <div className="flex-1">
        <Header title={title} />
        <main className="p-5">{children}</main>
      </div>
    </div>
  );
}
