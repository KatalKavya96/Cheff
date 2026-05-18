import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { PageHeader } from "@/components/shared/page-header";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        badge="Daily command center"
        title="Dashboard"
        description="Track today’s active diet day, meal consistency, grocery progress, streaks, and the next prep step in one place."
      />
      <DashboardClient />
    </>
  );
}
