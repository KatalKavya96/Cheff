import { z } from "zod";

import { getGroceriesByScope } from "@/features/grocery/services/grocery-service";
import type { GroceryScope } from "@/features/grocery/types/grocery";
import { handleRouteError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  scope: z.enum(["today", "tomorrow", "day", "week"]).optional(),
  dayNumber: z.coerce.number().int().min(1).max(7).optional()
});

export async function GET(request: Request) {
  try {
    const searchParams = Object.fromEntries(new URL(request.url).searchParams);
    const query = querySchema.parse(searchParams);
    const scope: GroceryScope = query.dayNumber ? "day" : query.scope ?? "week";

    return ok(await getGroceriesByScope(scope, query.dayNumber));
  } catch (error) {
    return handleRouteError(error);
  }
}
