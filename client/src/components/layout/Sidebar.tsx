"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RoleName } from "@/types/auth";

const labels: Record<RoleName, string> = {
  ADMIN: "Administrator",
  PROJECT_MANAGER: "Project Manager",
  TEAM_MEMBER: "Team Member"
};

const basePath: Record<RoleName, string> = {
  ADMIN: "/admin",
  PROJECT_MANAGER: "/manager",
  TEAM_MEMBER: "/member"
};

export function Sidebar({ role }: { role: RoleName }) {
  const pathname = usePathname();
  const links = [
    { label: "Dashboard", href: `${basePath[role]}/dashboard` },
    ...(role === "ADMIN" ? [{ label: "Users", href: "/admin/users" }] : []),
    { label: "Projects", href: `${basePath[role]}/projects` }
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
