import { z } from "zod";

import { upsertGroceryLog } from "@/features/grocery/services/grocery-service";
import { created, handleRouteError } from "@/lib/api";

export const dynamic = "force-dynamic";

const groceryLogSchema = z.object({
  groceryItemId: z.string().min(1),
  completed: z.boolean(),
  date: z.coerce.date().optional()
});

export async function POST(request: Request) {
  try {
    const body = groceryLogSchema.parse(await request.json());
    return created(await upsertGroceryLog(body));
  } catch (error) {
    return handleRouteError(error);
  }
}
