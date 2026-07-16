import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard";
export default function UserDashboardPage() { return <DashboardLayout role="USER" title="My Dashboard"><OverviewDashboard role="USER" /></DashboardLayout>; }
