import { getStreakStats } from "@/features/analysis/services/analysis-service";
import { handleRouteError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await getStreakStats());
  } catch (error) {
    return handleRouteError(error);
  }
}
