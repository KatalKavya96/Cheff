import { AnalysisClient } from "@/components/analysis/analysis-client";
import { PageHeader } from "@/components/shared/page-header";

export default function AnalysisPage() {
  return (
    <>
      <PageHeader
        badge="Recharts consistency history"
        title="Analysis"
        description="Review daily consistency, streaks, meal totals, replaced meals, skipped meals, weekly average, and meal-wise trends."
      />
      <AnalysisClient />
    </>
  );
}
