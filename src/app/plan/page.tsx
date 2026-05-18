import { PageHeader } from "@/components/shared/page-header";
import { PlanClient } from "@/components/plan/plan-client";

export default function PlanPage() {
  return (
    <>
      <PageHeader
        badge="Complete 7-day plan"
        title="7-Day Pure Veg Gym Meal Plan"
        description="Browse every meal in the repeating cycle, search by dish or ingredient, and open any item for ingredients, preparation steps, benefits, and goal tags."
      />
      <PlanClient />
    </>
  );
}
