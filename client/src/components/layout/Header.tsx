"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

export function Header({ title }: { title: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
        {user ? <p className="text-sm text-slate-500">{user.name} · {user.email} · {user.role}</p> : null}
      </div>
      <Button variant="secondary" onClick={() => void logout()}>
        Logout
      </Button>
    </header>
  );
}
