import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function ManagerDashboardPage() {
  return (
    <DashboardLayout role="PROJECT_MANAGER" title="Project Manager Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        {["Active Projects", "Assigned Members", "Open Tasks"].map((label) => (
          <section key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">0</p>
          </section>
        ))}
      </div>
    </DashboardLayout>
  );
}
