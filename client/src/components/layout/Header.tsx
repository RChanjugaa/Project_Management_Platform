"use client";

import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export function Header({ title }: { title: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex flex-col gap-4 border-b border-[var(--border)] bg-[var(--surface)]/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">{title}</h1>
        {user ? <p className="text-sm text-[var(--muted)]">{user.name} · {user.email} · {user.role}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ThemeToggle />
        <Button variant="secondary" onClick={() => void logout()}>
          Logout
        </Button>
      </div>
    </header>
  );
}
