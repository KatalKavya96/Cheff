import { type MealLog, type MealStatus, Prisma } from "@prisma/client";

import type { MealStatusValue } from "@/features/diet/types/diet";
import { getDefaultUser } from "@/features/diet/services/settings-service";
import { serializeMealWithLog } from "@/features/diet/services/serializers";
import {
  getActivePlanDay,
  getDateForPlanDayInCurrentCycle,
  normalizeDate,
  toDateKey
} from "@/lib/date-cycle";
import { prisma } from "@/lib/prisma";

export function scoreMealStatus(status: MealStatusValue) {
  if (status === "ATE") {
    return 1;
  }

  if (status === "REPLACED") {
    return 0.5;
  }

  return 0;
}

export function calculateMealProgress(logs: MealLog[], totalPlannedMeals: number) {
  const ate = logs.filter((log) => log.status === "ATE").length;
  const skipped = logs.filter((log) => log.status === "SKIPPED").length;
  const replaced = logs.filter((log) => log.status === "REPLACED").length;
  const earnedPoints = logs.reduce(
    (total, log) => total + scoreMealStatus(log.status as MealStatusValue),
    0
  );
  const consistencyPercentage =
    totalPlannedMeals > 0 ? Math.round((earnedPoints / totalPlannedMeals) * 100) : 0;

  return {
    totalPlannedMeals,
    markedMeals: logs.filter((log) => log.status !== "NOT_MARKED").length,
    ate,
    skipped,
    replaced,
    earnedPoints,
    consistencyPercentage
  };
}

export async function getMealsForDate(currentDate = new Date()) {
  const user = await getDefaultUser();
  const date = normalizeDate(currentDate);
  const planStartDate = user.planStartDate ?? date;
  const cycleDayNumber = getActivePlanDay(planStartDate, date);

  const dietDay = await prisma.dietDay.findUnique({
    where: { dayNumber: cycleDayNumber },
    include: {
      meals: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });

  if (!dietDay) {
    throw new Error("Diet plan has not been seeded. Run npx prisma db seed.");
  }

  const logs = await prisma.mealLog.findMany({
    where: {
      userId: user.id,
      date
    }
  });

  const logByMealId = new Map(logs.map((log) => [log.mealId, log]));

  return {
    date: toDateKey(date),
    cycleDayNumber,
    dayTitle: dietDay.title,
    meals: dietDay.meals.map((meal) =>
      serializeMealWithLog(meal, logByMealId.get(meal.id))
    ),
    progress: calculateMealProgress(logs, dietDay.meals.length)
  };
}

export async function upsertMealLog(input: {
  mealId: string;
  status: MealStatusValue;
  notes?: string | null;
  date?: Date;
}) {
  const user = await getDefaultUser();
  const meal = await prisma.meal.findUnique({
    where: { id: input.mealId },
    include: { dietDay: true }
  });

  if (!meal) {
    throw new Error("Meal not found.");
  }

  const targetDate = input.date
    ? normalizeDate(input.date)
    : getDateForPlanDayInCurrentCycle(
        user.planStartDate ?? new Date(),
        new Date(),
        meal.dietDay.dayNumber
      );

  const log = await prisma.mealLog.upsert({
    where: {
      userId_mealId_date: {
        userId: user.id,
        mealId: meal.id,
        date: targetDate
      }
    },
    update: {
      status: input.status as MealStatus,
      notes: input.notes?.trim() ? input.notes.trim() : null
    },
    create: {
      userId: user.id,
      mealId: meal.id,
      date: targetDate,
      cycleDayNumber: meal.dietDay.dayNumber,
      mealType: meal.mealType,
      status: input.status as MealStatus,
      notes: input.notes?.trim() ? input.notes.trim() : null
    }
  });

  return serializeMealWithLog(meal, log);
}

export async function patchMealLog(
  id: string,
  input: {
    status?: MealStatusValue;
    notes?: string | null;
  }
) {
  const user = await getDefaultUser();
  const normalizedNotes =
    input.notes === undefined
      ? undefined
      : input.notes?.trim()
        ? input.notes.trim()
        : null;

  const log = await prisma.mealLog.update({
    where: { id, userId: user.id },
    data: {
      status: input.status ? (input.status as MealStatus) : undefined,
      notes: normalizedNotes
    },
    include: {
      meal: true
    }
  });

  return serializeMealWithLog(log.meal, log);
}

export async function resetMealLogsForDate(currentDate = new Date()) {
  const user = await getDefaultUser();
  const date = normalizeDate(currentDate);

  await prisma.mealLog.deleteMany({
    where: {
      userId: user.id,
      date
    }
  });

  return getMealsForDate(date);
}

export async function getMealCountsByDay() {
  const days = await prisma.dietDay.findMany({
    include: {
      meals: {
        select: { id: true, mealType: true }
      }
    }
  });

  return new Map(
    days.map((day) => [
      day.dayNumber,
      {
        total: day.meals.length,
        meals: day.meals
      }
    ])
  );
}

export function mealLogWhereForDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Prisma.MealLogWhereInput {
  return {
    userId,
    date: {
      gte: normalizeDate(startDate),
      lte: normalizeDate(endDate)
    }
  };
}
