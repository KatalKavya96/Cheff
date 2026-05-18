import type { MealStatusValue, MealTypeValue } from "@/features/diet/types/diet";

export type MealLogInput = {
  mealId: string;
  date?: Date;
  status: MealStatusValue;
  notes?: string | null;
};

export type MealBreakdownItem = {
  mealType: MealTypeValue;
  planned: number;
  ate: number;
  skipped: number;
  replaced: number;
  consistencyPercentage: number;
};
