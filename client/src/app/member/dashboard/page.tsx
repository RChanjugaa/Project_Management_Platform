import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard";

export default function MemberDashboardPage() {
  return (
    <DashboardLayout role="TEAM_MEMBER" title="Team Member Dashboard">
      <OverviewDashboard role="TEAM_MEMBER" />
    </DashboardLayout>
  );
}
