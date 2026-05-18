import { z } from "zod";

import { updatePlanStartDate } from "@/features/diet/services/settings-service";
import { handleRouteError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

const schema = z.object({
  planStartDate: z.coerce.date()
});

export async function PATCH(request: Request) {
  try {
    const body = schema.parse(await request.json());
    return ok(await updatePlanStartDate(body.planStartDate));
  } catch (error) {
    return handleRouteError(error);
  }
}
