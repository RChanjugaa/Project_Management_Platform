import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProjectsPage } from "@/components/dashboard/ProjectsPage";
export default function UserProjectsPage() { return <DashboardLayout role="USER" title="My Projects"><ProjectsPage role="USER" /></DashboardLayout>; }
