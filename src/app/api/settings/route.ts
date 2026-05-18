import { getSettings } from "@/features/diet/services/settings-service";
import { handleRouteError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await getSettings());
  } catch (error) {
    return handleRouteError(error);
  }
}
