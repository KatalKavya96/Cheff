import { getDefaultUser } from "@/features/diet/services/settings-service";
import { serializeGroceryWithLog } from "@/features/diet/services/serializers";
import type { GroceryScope } from "@/features/grocery/types/grocery";
import {
  getActivePlanDay,
  getDateForPlanDayInCurrentCycle,
  getTomorrowPlanDay,
  normalizeDate,
  toDateKey
} from "@/lib/date-cycle";
import { prisma } from "@/lib/prisma";

export function calculateGroceryProgress(
  items: Array<{ completed: boolean }>
) {
  const totalItems = items.length;
  const boughtItems = items.filter((item) => item.completed).length;
  const pendingItems = totalItems - boughtItems;
  const completionPercentage =
    totalItems > 0 ? Math.round((boughtItems / totalItems) * 100) : 0;

  return {
    totalItems,
    boughtItems,
    pendingItems,
    completionPercentage
  };
}

async function getGroceryItemsForDay(dayNumber: number) {
  const dietDay = await prisma.dietDay.findUnique({
    where: { dayNumber },
    include: {
      groceries: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });

  if (!dietDay) {
    throw new Error("Diet plan has not been seeded. Run npx prisma db seed.");
  }

  return dietDay;
}

export async function getGroceriesForDay(
  dayNumber: number,
  targetDate?: Date
) {
  const user = await getDefaultUser();
  const planStartDate = user.planStartDate ?? new Date();
  const date =
    targetDate ??
    getDateForPlanDayInCurrentCycle(planStartDate, new Date(), dayNumber);
  const dietDay = await getGroceryItemsForDay(dayNumber);

  const logs = await prisma.groceryLog.findMany({
    where: {
      userId: user.id,
      date: normalizeDate(date)
    }
  });

  const logByItemId = new Map(logs.map((log) => [log.groceryItemId, log]));
  const items = dietDay.groceries.map((item) =>
    serializeGroceryWithLog(
      item,
      dayNumber,
      normalizeDate(date),
      logByItemId.get(item.id)
    )
  );

  return {
    scope: "day" as const,
    dayNumber,
    date: toDateKey(date),
    items,
    progress: calculateGroceryProgress(items)
  };
}

export async function getGroceriesByScope(
  scope: GroceryScope,
  dayNumber?: number
) {
  const user = await getDefaultUser();
  const currentDate = normalizeDate(new Date());
  const planStartDate = user.planStartDate ?? currentDate;

  if (scope === "today") {
    const activeDay = getActivePlanDay(planStartDate, currentDate);
    return getGroceriesForDay(activeDay, currentDate);
  }

  if (scope === "tomorrow") {
    const tomorrowDate = normalizeDate(new Date(currentDate.getTime() + 86_400_000));
    const tomorrowDay = getTomorrowPlanDay(planStartDate, currentDate);
    return getGroceriesForDay(tomorrowDay, tomorrowDate);
  }

  if (scope === "day") {
    if (!dayNumber) {
      throw new Error("dayNumber is required for day grocery scope.");
    }
    return getGroceriesForDay(dayNumber);
  }

  const days = await prisma.dietDay.findMany({
    orderBy: { dayNumber: "asc" },
    include: {
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

  const dateValues = Array.from(targetDates.values()).map((date) => normalizeDate(date));
  const logs = await prisma.groceryLog.findMany({
    where: {
      userId: user.id,
      date: {
        in: dateValues
      }
    }
  });

  const logByDateAndItemId = new Map(
    logs.map((log) => [`${toDateKey(log.date)}:${log.groceryItemId}`, log])
  );

  const items = days.flatMap((day) => {
    const targetDate = targetDates.get(day.dayNumber) ?? currentDate;
    return day.groceries.map((item) =>
      serializeGroceryWithLog(
        item,
        day.dayNumber,
        targetDate,
        logByDateAndItemId.get(`${toDateKey(targetDate)}:${item.id}`)
      )
    );
  });

  return {
    scope: "week" as const,
    dayNumber: null,
    date: null,
    items,
    progress: calculateGroceryProgress(items)
  };
}

export async function upsertGroceryLog(input: {
  groceryItemId: string;
  completed: boolean;
  date?: Date;
}) {
  const user = await getDefaultUser();
  const groceryItem = await prisma.groceryItem.findUnique({
    where: { id: input.groceryItemId },
    include: { dietDay: true }
  });

  if (!groceryItem) {
    throw new Error("Grocery item not found.");
  }

  const targetDate = input.date
    ? normalizeDate(input.date)
    : getDateForPlanDayInCurrentCycle(
        user.planStartDate ?? new Date(),
        new Date(),
        groceryItem.dietDay.dayNumber
      );

  const log = await prisma.groceryLog.upsert({
    where: {
      userId_groceryItemId_date: {
        userId: user.id,
        groceryItemId: groceryItem.id,
        date: targetDate
      }
    },
    update: {
      completed: input.completed
    },
    create: {
      userId: user.id,
      groceryItemId: groceryItem.id,
      date: targetDate,
      cycleDayNumber: groceryItem.dietDay.dayNumber,
      completed: input.completed
    }
  });

  return serializeGroceryWithLog(
    groceryItem,
    groceryItem.dietDay.dayNumber,
    targetDate,
    log
  );
}

export async function patchGroceryLog(id: string, completed: boolean) {
  const user = await getDefaultUser();
  const log = await prisma.groceryLog.update({
    where: { id, userId: user.id },
    data: { completed },
    include: {
      groceryItem: true
    }
  });

  return serializeGroceryWithLog(
    log.groceryItem,
    log.cycleDayNumber,
    log.date,
    log
  );
}
