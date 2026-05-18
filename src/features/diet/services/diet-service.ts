import { getGroceriesByScope } from "@/features/grocery/services/grocery-service";
import { getDefaultUser } from "@/features/diet/services/settings-service";
import { serializeMealWithLog } from "@/features/diet/services/serializers";
import {
  calculateMealProgress,
  getMealsForDate
} from "@/features/tracker/services/tracker-service";
import {
  getActivePlanDay,
  getCycleDateInfo,
  getDateForPlanDayInCurrentCycle,
  toDateKey
} from "@/lib/date-cycle";
import { prisma } from "@/lib/prisma";

function calculateGroceryStats(
  completedCount: number,
  totalItems: number
) {
  return {
    totalItems,
    boughtItems: completedCount,
    pendingItems: totalItems - completedCount,
    completionPercentage:
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0
  };
}

export async function getDietDaysWithStats() {
  const user = await getDefaultUser();
  const currentDate = new Date();
  const planStartDate = user.planStartDate ?? currentDate;

  const days = await prisma.dietDay.findMany({
    orderBy: { dayNumber: "asc" },
    include: {
      meals: {
        orderBy: { sortOrder: "asc" }
      },
      groceries: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });

  const targetDates = new Map(
    days.map((day) => [
      day.dayNumber,
      getDateForPlanDayInCurrentCycle(planStartDate, currentDate, day.dayNumber)
    ])
  );
  const dates = Array.from(targetDates.values());

  const [mealLogs, groceryLogs] = await Promise.all([
    prisma.mealLog.findMany({
      where: {
        userId: user.id,
        date: { in: dates }
      }
    }),
    prisma.groceryLog.findMany({
      where: {
        userId: user.id,
        date: { in: dates }
      }
    })
  ]);

  return days.map((day) => {
    const targetDate = targetDates.get(day.dayNumber) ?? currentDate;
    const dayMealLogs = mealLogs.filter(
      (log) => toDateKey(log.date) === toDateKey(targetDate)
    );
    const dayGroceryLogs = groceryLogs.filter(
      (log) => toDateKey(log.date) === toDateKey(targetDate)
    );
    const logByMealId = new Map(dayMealLogs.map((log) => [log.mealId, log]));

    return {
      id: day.id,
      dayNumber: day.dayNumber,
      title: day.title,
      targetDate: toDateKey(targetDate),
      meals: day.meals.map((meal) =>
        serializeMealWithLog(meal, logByMealId.get(meal.id))
      ),
      mealProgress: calculateMealProgress(dayMealLogs, day.meals.length),
      groceryProgress: calculateGroceryStats(
        dayGroceryLogs.filter((log) => log.completed).length,
        day.groceries.length
      )
    };
  });
}

export async function getDietDayByNumber(dayNumber: number) {
  if (dayNumber < 1 || dayNumber > 7) {
    throw new Error("dayNumber must be between 1 and 7.");
  }

  const days = await getDietDaysWithStats();
  const day = days.find((item) => item.dayNumber === dayNumber);

  if (!day) {
    throw new Error("Diet plan has not been seeded. Run npx prisma db seed.");
  }

  return day;
}

export async function getTodayDiet() {
  const user = await getDefaultUser();
  const currentDate = new Date();
  const planStartDate = user.planStartDate ?? currentDate;
  const cycleInfo = getCycleDateInfo(planStartDate, currentDate);
  const meals = await getMealsForDate(currentDate);
  const groceries = await getGroceriesByScope("today");
  const tomorrowGroceries = await getGroceriesByScope("tomorrow");

  return {
    currentDate: toDateKey(currentDate),
    planStartDate: toDateKey(planStartDate),
    cycleInfo: {
      ...cycleInfo,
      currentDate: toDateKey(cycleInfo.currentDate),
      planStartDate: toDateKey(cycleInfo.planStartDate),
      currentCycleStartDate: toDateKey(cycleInfo.currentCycleStartDate)
    },
    activePlanDay: getActivePlanDay(planStartDate, currentDate),
    meals,
    groceries,
    tomorrowGroceries
  };
}
