import { UsersPage } from "@/components/dashboard/UsersPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AdminUsersPage() {
  return (
    <DashboardLayout role="ADMIN" title="Users">
      <UsersPage />
    </DashboardLayout>
  );
}
