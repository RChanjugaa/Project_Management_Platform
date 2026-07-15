import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout role="ADMIN" title="Administrator Dashboard">
      <OverviewDashboard role="ADMIN" />
    </DashboardLayout>
  );
}
