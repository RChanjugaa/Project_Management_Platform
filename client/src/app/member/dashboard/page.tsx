import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WorkspaceDashboard } from "@/components/dashboard/WorkspaceDashboard";

export default function MemberDashboardPage() {
  return (
    <DashboardLayout role="TEAM_MEMBER" title="Team Member Dashboard">
      <WorkspaceDashboard role="TEAM_MEMBER" />
    </DashboardLayout>
  );
}
