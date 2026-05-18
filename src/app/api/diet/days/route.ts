import { handleRouteError, ok } from "@/lib/api";
import { getDietDaysWithStats } from "@/features/diet/services/diet-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await getDietDaysWithStats());
  } catch (error) {
    return handleRouteError(error);
  }
}
