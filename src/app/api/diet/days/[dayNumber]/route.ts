import { z } from "zod";

import { getDietDayByNumber } from "@/features/diet/services/diet-service";
import { handleRouteError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

const paramsSchema = z.object({
  dayNumber: z.coerce.number().int().min(1).max(7)
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dayNumber: string }> }
) {
  try {
    const { dayNumber } = paramsSchema.parse(await params);
    return ok(await getDietDayByNumber(dayNumber));
  } catch (error) {
    return handleRouteError(error);
  }
}
