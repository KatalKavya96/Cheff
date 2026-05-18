import { z } from "zod";

import { upsertMealLog } from "@/features/tracker/services/tracker-service";
import { created, handleRouteError } from "@/lib/api";

export const dynamic = "force-dynamic";

const mealLogSchema = z.object({
  mealId: z.string().min(1),
  status: z.enum(["NOT_MARKED", "ATE", "SKIPPED", "REPLACED"]),
  notes: z.string().max(600).nullable().optional(),
  date: z.coerce.date().optional()
});

export async function POST(request: Request) {
  try {
    const body = mealLogSchema.parse(await request.json());
    return created(await upsertMealLog(body));
  } catch (error) {
    return handleRouteError(error);
  }
}
