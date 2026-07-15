import { ProjectsPage } from "@/components/dashboard/ProjectsPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function ManagerProjectsPage() {
  return (
    <DashboardLayout role="PROJECT_MANAGER" title="Projects">
      <ProjectsPage role="PROJECT_MANAGER" />
    </DashboardLayout>
  );
}
