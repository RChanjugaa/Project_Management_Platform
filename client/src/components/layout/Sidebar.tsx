"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SystemRole } from "@/types/auth";

const labels: Record<SystemRole, string> = {
  ADMIN: "Administrator",
  USER: "Project workspace"
};

const basePath: Record<SystemRole, string> = {
  ADMIN: "/admin",
  USER: ""
};

export function Sidebar({ role }: { role: SystemRole }) {
  const pathname = usePathname();
  const links = [
    { label: "Dashboard", href: `${basePath[role]}/dashboard` },
    ...(role === "ADMIN" ? [{ label: "Users", href: "/admin/users" }] : []),
    { label: "Projects", href: role === "ADMIN" ? "/admin/projects" : "/projects" },
    { label: "Notifications", href: "/notifications" },
    { label: "Profile", href: "/profile" },
    ...(role === "ADMIN" ? [{ label: "Activity", href: "/admin/activity" }] : [])
  ];

  return (
    <aside className="border-b border-[var(--border)] bg-[var(--surface)] px-5 py-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-bold text-[#2d3748] shadow-sm">PD</div>
        <div>
          <p className="text-lg font-bold text-[var(--text)]">PulseDeck</p>
          <p className="text-sm text-[var(--muted)]">{labels[role]}</p>
        </div>
      </div>
      <nav className="mt-6 flex gap-2 md:flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              pathname === link.href ? "bg-[var(--surface-soft)] text-[var(--text)] shadow-sm" : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
