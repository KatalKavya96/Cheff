import { PageHeader } from "@/components/shared/page-header";
import { TrackerClient } from "@/components/tracker/tracker-client";

export default function TrackerPage() {
  return (
    <>
      <PageHeader
        badge="Date-based meal logs"
        title="Meal Tracker"
        description="Mark each planned meal as ate, skipped, replaced, or not marked. Replaced meals count as partial consistency in analysis."
      />
      <TrackerClient />
    </>
  );
}
