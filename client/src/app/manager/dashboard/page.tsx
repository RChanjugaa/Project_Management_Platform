import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WorkspaceDashboard } from "@/components/dashboard/WorkspaceDashboard";

export default function ManagerDashboardPage() {
  return (
    <DashboardLayout role="PROJECT_MANAGER" title="Project Manager Dashboard">
      <WorkspaceDashboard role="PROJECT_MANAGER" />
    </DashboardLayout>
  );
}
