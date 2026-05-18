import type { MealStatusValue, MealTypeValue } from "@/features/diet/types/diet";
import { MEAL_TYPE_LABELS, MEAL_TYPE_ORDER } from "@/features/diet/utils/meal-format";
import type {
  AnalysisSummary,
  ConsistencyPoint
} from "@/features/analysis/types/analysis";
import { getDefaultUser } from "@/features/diet/services/settings-service";
import {
  calculateMealProgress,
  getMealCountsByDay,
  mealLogWhereForDateRange,
  scoreMealStatus
} from "@/features/tracker/services/tracker-service";
import type { MealBreakdownItem } from "@/features/tracker/types/tracker";
import {
  getActivePlanDay,
  getRecentDateRange,
  normalizeDate,
  toDateKey
} from "@/lib/date-cycle";
import { prisma } from "@/lib/prisma";

const CONSISTENT_DAY_THRESHOLD = 80;

function average(points: Array<{ consistencyPercentage: number }>) {
  if (points.length === 0) {
    return 0;
  }

  return Math.round(
    points.reduce((total, point) => total + point.consistencyPercentage, 0) /
      points.length
  );
}

export async function getConsistencySeries(days = 30): Promise<ConsistencyPoint[]> {
  const user = await getDefaultUser();
  const currentDate = normalizeDate(new Date());
  const planStartDate = user.planStartDate ?? currentDate;
  const dateRange = getRecentDateRange(currentDate, days);
  const mealCountsByDay = await getMealCountsByDay();

  const logs = await prisma.mealLog.findMany({
    where: mealLogWhereForDateRange(
      user.id,
      dateRange[0] ?? currentDate,
      dateRange[dateRange.length - 1] ?? currentDate
    )
  });

  return dateRange.map((date) => {
    const cycleDayNumber = getActivePlanDay(planStartDate, date);
    const plannedMeals = mealCountsByDay.get(cycleDayNumber)?.total ?? 0;
    const dayLogs = logs.filter((log) => toDateKey(log.date) === toDateKey(date));
    const progress = calculateMealProgress(dayLogs, plannedMeals);

    return {
      date: toDateKey(date),
      cycleDayNumber,
      consistencyPercentage: progress.consistencyPercentage,
      earnedPoints: progress.earnedPoints,
      plannedMeals,
      ate: progress.ate,
      skipped: progress.skipped,
      replaced: progress.replaced
    };
  });
}

export function calculateStreaks(series: ConsistencyPoint[]) {
  let currentStreak = 0;

  for (const point of [...series].reverse()) {
    if (point.consistencyPercentage >= CONSISTENT_DAY_THRESHOLD) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  let bestStreak = 0;
  let running = 0;

  for (const point of series) {
    if (point.consistencyPercentage >= CONSISTENT_DAY_THRESHOLD) {
      running += 1;
      bestStreak = Math.max(bestStreak, running);
    } else {
      running = 0;
    }
  }

  return { currentStreak, bestStreak };
}

export async function getStreakStats() {
  const series = await getConsistencySeries(90);
  return calculateStreaks(series);
}

async function getMealWiseBreakdown(days = 30): Promise<MealBreakdownItem[]> {
  const user = await getDefaultUser();
  const currentDate = normalizeDate(new Date());
  const planStartDate = user.planStartDate ?? currentDate;
  const dateRange = getRecentDateRange(currentDate, days);
  const dietDays = await prisma.dietDay.findMany({
    include: {
      meals: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });
  const dayByNumber = new Map(dietDays.map((day) => [day.dayNumber, day]));
  const logs = await prisma.mealLog.findMany({
    where: mealLogWhereForDateRange(
      user.id,
      dateRange[0] ?? currentDate,
      dateRange[dateRange.length - 1] ?? currentDate
    )
  });
  const logByDateMeal = new Map(
    logs.map((log) => [`${toDateKey(log.date)}:${log.mealId}`, log])
  );

  const breakdown = new Map<
    MealTypeValue,
    {
      planned: number;
      ate: number;
      skipped: number;
      replaced: number;
      earned: number;
    }
  >(
    MEAL_TYPE_ORDER.map((mealType) => [
      mealType,
      { planned: 0, ate: 0, skipped: 0, replaced: 0, earned: 0 }
    ])
  );

  for (const date of dateRange) {
    const cycleDayNumber = getActivePlanDay(planStartDate, date);
    const day = dayByNumber.get(cycleDayNumber);
    if (!day) {
      continue;
    }

    for (const meal of day.meals) {
      const mealType = meal.mealType as MealTypeValue;
      const item = breakdown.get(mealType);
      if (!item) {
        continue;
      }

      const log = logByDateMeal.get(`${toDateKey(date)}:${meal.id}`);
      const status = (log?.status ?? "NOT_MARKED") as MealStatusValue;
      item.planned += 1;
      item.earned += scoreMealStatus(status);
      if (status === "ATE") {
        item.ate += 1;
      }
      if (status === "SKIPPED") {
        item.skipped += 1;
      }
      if (status === "REPLACED") {
        item.replaced += 1;
      }
    }
  }

  return MEAL_TYPE_ORDER.map((mealType) => {
    const item = breakdown.get(mealType) ?? {
      planned: 0,
      ate: 0,
      skipped: 0,
      replaced: 0,
      earned: 0
    };

    return {
      mealType,
      planned: item.planned,
      ate: item.ate,
      skipped: item.skipped,
      replaced: item.replaced,
      consistencyPercentage:
        item.planned > 0 ? Math.round((item.earned / item.planned) * 100) : 0
    };
  });
}

function buildMotivationalMessage(last7DaysConsistency: number) {
  if (last7DaysConsistency >= 90) {
    return "Excellent consistency. Keep portions steady and recovery boringly reliable.";
  }

  if (last7DaysConsistency >= 70) {
    return "Strong week. Tighten the skipped meals and the plan will compound nicely.";
  }

  if (last7DaysConsistency >= 40) {
    return "Momentum is there. Start by protecting breakfast and post-workout meals.";
  }

  return "Reset gently today. One planned meal done well is the first win back.";
}

export async function getAnalysisSummary(): Promise<AnalysisSummary> {
  const [series30, series90, mealWiseBreakdown] = await Promise.all([
    getConsistencySeries(30),
    getConsistencySeries(90),
    getMealWiseBreakdown(30)
  ]);

  const last7 = series30.slice(-7);
  const streaks = calculateStreaks(series90);
  const totalMealsPlanned = series30.reduce(
    (total, point) => total + point.plannedMeals,
    0
  );
  const totalMealsEaten = series30.reduce((total, point) => total + point.ate, 0);
  const totalMealsSkipped = series30.reduce(
    (total, point) => total + point.skipped,
    0
  );
  const totalMealsReplaced = series30.reduce(
    (total, point) => total + point.replaced,
    0
  );
  const mostMissed = [...mealWiseBreakdown].sort(
    (a, b) => b.skipped - a.skipped
  )[0];

  const last7DaysConsistency = average(last7);
  const last30DaysConsistency = average(series30);

  return {
    last7DaysConsistency,
    last30DaysConsistency,
    totalMealsPlanned,
    totalMealsEaten,
    totalMealsSkipped,
    totalMealsReplaced,
    currentStreak: streaks.currentStreak,
    bestStreak: streaks.bestStreak,
    averageWeeklyConsistency: last7DaysConsistency,
    mealWiseBreakdown,
    mostMissedMealType:
      mostMissed && mostMissed.skipped > 0
        ? MEAL_TYPE_LABELS[mostMissed.mealType]
        : null,
    motivationalMessage: buildMotivationalMessage(last7DaysConsistency)
  };
}
