import type { Meal, MealLog, GroceryItem, GroceryLog } from "@prisma/client";

import type {
  GroceryWithLog,
  MealStatusValue,
  MealTag,
  MealTypeValue,
  MealWithLog
} from "@/features/diet/types/diet";
import { toDateKey } from "@/lib/date-cycle";

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function toMealTagArray(value: unknown): MealTag[] {
  return Array.isArray(value)
    ? value.filter((item): item is MealTag => typeof item === "string")
    : [];
}

export function serializeMealWithLog(
  meal: Meal,
  log?: MealLog | null
): MealWithLog {
  return {
    id: meal.id,
    dietDayId: meal.dietDayId,
    mealType: meal.mealType as MealTypeValue,
    name: meal.name,
    description: meal.description,
    ingredients: toStringArray(meal.ingredients),
    recipeSteps: toStringArray(meal.recipeSteps),
    benefits: toStringArray(meal.benefits),
    tags: toMealTagArray(meal.tags),
    logId: log?.id ?? null,
    status: (log?.status ?? "NOT_MARKED") as MealStatusValue,
    notes: log?.notes ?? null
  };
}

export function serializeGroceryWithLog(
  item: GroceryItem,
  cycleDayNumber: number,
  targetDate: Date,
  log?: GroceryLog | null
): GroceryWithLog {
  return {
    id: item.id,
    dietDayId: item.dietDayId,
    name: item.name,
    quantity: item.quantity,
    relatedMeal: item.relatedMeal,
    relatedDish: item.relatedDish,
    logId: log?.id ?? null,
    completed: log?.completed ?? false,
    cycleDayNumber,
    targetDate: toDateKey(targetDate)
  };
}
