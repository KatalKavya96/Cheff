import { getTodayDiet } from "@/features/diet/services/diet-service";
import { handleRouteError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await getTodayDiet());
  } catch (error) {
    return handleRouteError(error);
  }
}
