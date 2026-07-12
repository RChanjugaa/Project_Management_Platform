import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function MemberDashboardPage() {
  return (
    <DashboardLayout role="TEAM_MEMBER" title="Team Member Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        {["Assigned Projects", "Assigned Tasks", "Completed Tasks"].map((label) => (
          <section key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">0</p>
          </section>
        ))}
      </div>
    </DashboardLayout>
  );
}
