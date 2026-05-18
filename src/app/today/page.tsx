import { TodayClient } from "@/components/dashboard/today-client";
import { PageHeader } from "@/components/shared/page-header";

export default function TodayPage() {
  return (
    <>
      <PageHeader
        badge="Auto-mapped cycle day"
        title="Today"
        description="See the current active diet day, every planned meal, today’s focus, and a grocery preview based on your plan start date."
      />
      <TodayClient />
    </>
  );
}
