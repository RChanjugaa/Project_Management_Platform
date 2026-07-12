import type { RoleName } from "@/types/auth";

const labels: Record<RoleName, string> = {
  ADMIN: "Administrator",
  PROJECT_MANAGER: "Project Manager",
  TEAM_MEMBER: "Team Member"
};

export function Sidebar({ role }: { role: RoleName }) {
  return (
    <aside className="border-b border-slate-200 bg-white px-5 py-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div>
        <p className="text-lg font-bold text-slate-950">TaskFlow PM</p>
        <p className="text-sm text-slate-500">{labels[role]}</p>
      </div>
      <nav className="mt-6 flex gap-2 md:flex-col">
        <span className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white">Dashboard</span>
        <span className="rounded-md px-3 py-2 text-sm text-slate-500">Projects</span>
        <span className="rounded-md px-3 py-2 text-sm text-slate-500">Tasks</span>
      </nav>
    </aside>
  );
}
