import { ProjectsPage } from "@/components/dashboard/ProjectsPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AdminProjectsPage() {
  return (
    <DashboardLayout role="ADMIN" title="Projects">
      <ProjectsPage role="ADMIN" />
    </DashboardLayout>
  );
}
