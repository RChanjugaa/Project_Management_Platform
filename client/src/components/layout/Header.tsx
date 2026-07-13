"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

export function Header({ title }: { title: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-col gap-4 border-b border-[#a7d8de] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3748]">{title}</h1>
        {user ? <p className="text-sm text-[#2d3748]/70">{user.name} · {user.email} · {user.role}</p> : null}
      </div>
      <Button variant="secondary" onClick={() => void logout()}>
        Logout
      </Button>
    </header>
  );
}
