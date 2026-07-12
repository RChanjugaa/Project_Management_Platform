import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout role="ADMIN" title="Administrator Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        {["Users", "Projects", "System Roles"].map((label) => (
          <section key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">0</p>
          </section>
        ))}
      </div>
    </DashboardLayout>
  );
}
