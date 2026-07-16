"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useRequireRole } from "@/hooks/useRequireRole";
import type { SystemRole } from "@/types/auth";

export function DashboardLayout({ role, title, children }: { role?: SystemRole; title: string; children: React.ReactNode }) {
  const { user, isLoading, isAuthorized } = useRequireRole(role);

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
      <Sidebar role={user!.systemRole} />
      <div className="flex-1">
        <Header title={title} />
        <main className="p-5">{children}</main>
      </div>
    </div>
  );
}
