import { getMealsForDate, resetMealLogsForDate } from "@/features/tracker/services/tracker-service";
import { handleRouteError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await getMealsForDate());
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE() {
  try {
    return ok(await resetMealLogsForDate());
  } catch (error) {
    return handleRouteError(error);
  }
}
