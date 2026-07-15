import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard";

export default function ManagerDashboardPage() {
  return (
    <DashboardLayout role="PROJECT_MANAGER" title="Project Manager Dashboard">
      <OverviewDashboard role="PROJECT_MANAGER" />
    </DashboardLayout>
  );
}
