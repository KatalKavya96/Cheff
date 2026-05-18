import type { MealTypeValue } from "../types/diet";

export const MEAL_TYPE_LABELS: Record<MealTypeValue, string> = {
  BREAKFAST: "Breakfast",
  MID_MORNING: "Mid Morning",
  LUNCH: "Lunch",
  PRE_WORKOUT: "Pre-Workout",
  POST_WORKOUT: "Post-Workout",
  DINNER: "Dinner",
  BEFORE_SLEEP: "Before Sleep"
};

export const MEAL_TYPE_ORDER: MealTypeValue[] = [
  "BREAKFAST",
  "MID_MORNING",
  "LUNCH",
  "PRE_WORKOUT",
  "POST_WORKOUT",
  "DINNER",
  "BEFORE_SLEEP"
];

export function getMealTypeLabel(mealType: MealTypeValue) {
  return MEAL_TYPE_LABELS[mealType];
}
