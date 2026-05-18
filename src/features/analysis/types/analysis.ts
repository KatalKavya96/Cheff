import type { MealBreakdownItem } from "@/features/tracker/types/tracker";

export type ConsistencyPoint = {
  date: string;
  cycleDayNumber: number;
  consistencyPercentage: number;
  earnedPoints: number;
  plannedMeals: number;
  ate: number;
  skipped: number;
  replaced: number;
};

export type AnalysisSummary = {
  last7DaysConsistency: number;
  last30DaysConsistency: number;
  totalMealsPlanned: number;
  totalMealsEaten: number;
  totalMealsSkipped: number;
  totalMealsReplaced: number;
  currentStreak: number;
  bestStreak: number;
  averageWeeklyConsistency: number;
  mealWiseBreakdown: MealBreakdownItem[];
  mostMissedMealType: string | null;
  motivationalMessage: string;
};
