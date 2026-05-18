export type MealTypeValue =
  | "BREAKFAST"
  | "MID_MORNING"
  | "LUNCH"
  | "PRE_WORKOUT"
  | "POST_WORKOUT"
  | "DINNER"
  | "BEFORE_SLEEP";

export type MealStatusValue = "NOT_MARKED" | "ATE" | "SKIPPED" | "REPLACED";

export type MealTag =
  | "High Protein"
  | "Iron Boost"
  | "Muscle Gain"
  | "Energy"
  | "Hair Health"
  | "Skin Glow"
  | "Recovery"
  | "Clean Bulk";

export type DietMealSeed = {
  mealType: MealTypeValue;
  name: string;
  description?: string;
  ingredients: string[];
  recipeSteps: string[];
  benefits: string[];
  tags: MealTag[];
};

export type DietDaySeed = {
  dayNumber: number;
  title: string;
  meals: DietMealSeed[];
};

export type GrocerySeed = {
  dayNumber: number;
  name: string;
  quantity: string;
  relatedMeal: string;
  relatedDish: string;
};

export type MealWithLog = {
  id: string;
  dietDayId: string;
  mealType: MealTypeValue;
  name: string;
  description: string | null;
  ingredients: string[];
  recipeSteps: string[];
  benefits: string[];
  tags: MealTag[];
  logId: string | null;
  status: MealStatusValue;
  notes: string | null;
};

export type GroceryWithLog = {
  id: string;
  dietDayId: string;
  name: string;
  quantity: string | null;
  relatedMeal: string | null;
  relatedDish: string | null;
  logId: string | null;
  completed: boolean;
  cycleDayNumber: number;
  targetDate: string;
};

export type ProgressStats = {
  totalPlannedMeals?: number;
  markedMeals?: number;
  ate?: number;
  skipped?: number;
  replaced?: number;
  earnedPoints?: number;
  totalItems?: number;
  boughtItems?: number;
  pendingItems?: number;
  consistencyPercentage?: number;
  completionPercentage?: number;
};

export type DietDayWithStats = {
  id: string;
  dayNumber: number;
  title: string | null;
  targetDate: string;
  meals: MealWithLog[];
  mealProgress: ProgressStats;
  groceryProgress: ProgressStats;
};
