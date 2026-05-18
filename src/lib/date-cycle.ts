import {
  addDays,
  differenceInCalendarDays,
  format,
  startOfDay,
  subDays
} from "date-fns";

export type CycleDateInfo = {
  currentDate: Date;
  planStartDate: Date;
  daysPassed: number;
  activePlanDay: number;
  tomorrowPlanDay: number;
  currentCycleNumber: number;
  currentCycleStartDate: Date;
};

function positiveModulo(value: number, modulo: number) {
  return ((value % modulo) + modulo) % modulo;
}

export function normalizeDate(date: Date) {
  return startOfDay(date);
}

export function toDateKey(date: Date) {
  return format(normalizeDate(date), "yyyy-MM-dd");
}

export function getActivePlanDay(planStartDate: Date, currentDate: Date): number {
  const daysPassed = differenceInCalendarDays(
    normalizeDate(currentDate),
    normalizeDate(planStartDate)
  );

  return positiveModulo(daysPassed, 7) + 1;
}

export function getTomorrowPlanDay(
  planStartDate: Date,
  currentDate: Date
): number {
  return getActivePlanDay(planStartDate, addDays(currentDate, 1));
}

export function getCycleDateInfo(
  planStartDate: Date,
  currentDate: Date
): CycleDateInfo {
  const normalizedStart = normalizeDate(planStartDate);
  const normalizedCurrent = normalizeDate(currentDate);
  const daysPassed = differenceInCalendarDays(normalizedCurrent, normalizedStart);
  const cycleOffset = Math.floor(daysPassed / 7);
  const currentCycleStartDate = addDays(normalizedStart, cycleOffset * 7);

  return {
    currentDate: normalizedCurrent,
    planStartDate: normalizedStart,
    daysPassed,
    activePlanDay: positiveModulo(daysPassed, 7) + 1,
    tomorrowPlanDay: getTomorrowPlanDay(normalizedStart, normalizedCurrent),
    currentCycleNumber: cycleOffset + 1,
    currentCycleStartDate
  };
}

export function getDateForPlanDayInCurrentCycle(
  planStartDate: Date,
  currentDate: Date,
  dayNumber: number
) {
  const info = getCycleDateInfo(planStartDate, currentDate);
  return normalizeDate(addDays(info.currentCycleStartDate, dayNumber - 1));
}

export function getRecentDateRange(currentDate: Date, days: number) {
  const endDate = normalizeDate(currentDate);
  const startDate = subDays(endDate, days - 1);

  return Array.from({ length: days }, (_, index) => addDays(startDate, index));
}
