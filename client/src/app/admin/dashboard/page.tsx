import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WorkspaceDashboard } from "@/components/dashboard/WorkspaceDashboard";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout role="ADMIN" title="Administrator Dashboard">
      <WorkspaceDashboard role="ADMIN" />
    </DashboardLayout>
  );
}
