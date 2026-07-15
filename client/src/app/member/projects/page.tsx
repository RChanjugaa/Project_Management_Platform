import { ProjectsPage } from "@/components/dashboard/ProjectsPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function MemberProjectsPage() {
  return (
    <DashboardLayout role="TEAM_MEMBER" title="My Projects">
      <ProjectsPage role="TEAM_MEMBER" />
    </DashboardLayout>
  );
}
