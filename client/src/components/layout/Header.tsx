"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { workspaceApi } from "@/services/workspace.service";

export function Header({ title }: { title: string }) {
  const { user, logout } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    void workspaceApi.notifications().then((result) => setUnread(result.notifications.filter((item) => !item.isRead).length)).catch(() => undefined);
  }, [user]);

  return (
    <header className="sticky top-0 z-20 flex flex-col gap-4 border-b border-[var(--border)] bg-[var(--surface)]/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">{title}</h1>
        {user ? <p className="text-sm text-[var(--muted)]">{user.name} · {user.email} · {user.systemRole}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ThemeToggle />
        <Link href="/notifications" aria-label={`${unread} unread notifications`} className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition hover:bg-[var(--surface-soft)]">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6.5 9a5.5 5.5 0 0111 0c0 6 2.5 6 2.5 7.5H4C4 15 6.5 15 6.5 9z"/><path d="M10 20h4" strokeLinecap="round"/></svg>
          {unread ? <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-[#2d3748]">{unread > 99 ? "99+" : unread}</span> : null}
        </Link>
        <Button variant="secondary" onClick={() => void logout()}>Logout</Button>
      </div>
    </header>
  );
}
