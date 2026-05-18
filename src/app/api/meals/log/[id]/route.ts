import { z } from "zod";

import { patchMealLog } from "@/features/tracker/services/tracker-service";
import { handleRouteError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

const paramsSchema = z.object({
  id: z.string().min(1)
});

const patchSchema = z.object({
  status: z.enum(["NOT_MARKED", "ATE", "SKIPPED", "REPLACED"]).optional(),
  notes: z.string().max(600).nullable().optional()
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = paramsSchema.parse(await params);
    const body = patchSchema.parse(await request.json());
    return ok(await patchMealLog(id, body));
  } catch (error) {
    return handleRouteError(error);
  }
}
