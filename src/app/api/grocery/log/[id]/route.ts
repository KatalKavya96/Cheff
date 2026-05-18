import { z } from "zod";

import { patchGroceryLog } from "@/features/grocery/services/grocery-service";
import { handleRouteError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

const paramsSchema = z.object({
  id: z.string().min(1)
});

const patchSchema = z.object({
  completed: z.boolean()
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = paramsSchema.parse(await params);
    const body = patchSchema.parse(await request.json());
    return ok(await patchGroceryLog(id, body.completed));
  } catch (error) {
    return handleRouteError(error);
  }
}
