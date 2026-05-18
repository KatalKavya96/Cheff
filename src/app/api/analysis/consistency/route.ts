import { z } from "zod";

import { getConsistencySeries } from "@/features/analysis/services/analysis-service";
import { handleRouteError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  days: z.coerce.number().int().min(1).max(120).optional()
});

export async function GET(request: Request) {
  try {
    const query = querySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams)
    );
    return ok(await getConsistencySeries(query.days ?? 30));
  } catch (error) {
    return handleRouteError(error);
  }
}
