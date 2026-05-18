import { GroceryClient } from "@/components/grocery/grocery-client";
import { PageHeader } from "@/components/shared/page-header";

export default function GroceryPage() {
  return (
    <>
      <PageHeader
        badge="Checklist stored in MySQL"
        title="Grocery Planner"
        description="Plan today, tomorrow, any diet day, or the full active 7-day cycle with bought/pending state saved per date."
      />
      <GroceryClient />
    </>
  );
}
