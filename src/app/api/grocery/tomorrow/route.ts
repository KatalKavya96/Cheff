import { getGroceriesByScope } from "@/features/grocery/services/grocery-service";
import { handleRouteError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await getGroceriesByScope("tomorrow"));
  } catch (error) {
    return handleRouteError(error);
  }
}
