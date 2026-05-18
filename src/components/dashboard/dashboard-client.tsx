"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Flame,
  Salad,
  ShoppingBasket
} from "lucide-react";

import { fetchApi } from "@/components/shared/api-client";
import { StatCard } from "@/components/shared/stat-card";
import { MealDetailDialog } from "@/components/plan/meal-detail-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AnalysisSummary } from "@/features/analysis/types/analysis";
import type {
  GroceryWithLog,
  MealWithLog,
  ProgressStats
} from "@/features/diet/types/diet";
import {
  MEAL_TYPE_ORDER,
  getMealTypeLabel
} from "@/features/diet/utils/meal-format";

type TodayPayload = {
  currentDate: string;
  activePlanDay: number;
  meals: {
    date: string;
    cycleDayNumber: number;
    dayTitle: string | null;
    meals: MealWithLog[];
    progress: ProgressStats;
  };
  groceries: {
    progress: ProgressStats;
    items: GroceryWithLog[];
  };
  tomorrowGroceries: {
    dayNumber: number;
    items: GroceryWithLog[];
  };
};

export function DashboardClient() {
  const [today, setToday] = useState<TodayPayload | null>(null);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealWithLog | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      fetchApi<TodayPayload>("/api/diet/today"),
      fetchApi<AnalysisSummary>("/api/analysis/summary")
    ])
      .then(([todayData, summaryData]) => {
        if (mounted) {
          setToday(todayData);
          setSummary(summaryData);
          setError(null);
        }
      })
      .catch((requestError: Error) => {
        if (mounted) {
          setError(requestError.message);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!today || !summary) {
    return (
      <div className="grid gap-4">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="metric-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const mealProgress = today.meals.progress.consistencyPercentage ?? 0;
  const groceryProgress = today.groceries.progress.completionPercentage ?? 0;

  return (
    <>
      <div className="grid gap-4">
        <Card className="overflow-hidden">
          <CardContent className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant="secondary">{today.currentDate}</Badge>
                <Badge>Active Day {today.activePlanDay}</Badge>
              </div>
              <h2 className="text-2xl font-bold tracking-normal">
                {today.meals.dayTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Today’s focus is simple: hit the planned meals, prep the grocery
                list, and keep the 7-day vegetarian cycle moving.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 md:w-[420px]">
              <Button asChild>
                <Link href="/today">
                  <Salad className="h-4 w-4" />
                  View Today
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/grocery">
                  <ShoppingBasket className="h-4 w-4" />
                  Grocery List
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/tracker">
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Meals
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/analysis">
                  <BarChart3 className="h-4 w-4" />
                  Analysis
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="metric-grid">
          <StatCard
            title="Meal consistency"
            value={`${mealProgress}%`}
            helper={`${today.meals.progress.ate ?? 0} ate, ${
              today.meals.progress.replaced ?? 0
            } replaced`}
            icon={CheckCircle2}
            tone="green"
          />
          <StatCard
            title="Grocery progress"
            value={`${groceryProgress}%`}
            helper={`${today.groceries.progress.boughtItems ?? 0} bought of ${
              today.groceries.progress.totalItems ?? 0
            }`}
            icon={ShoppingBasket}
            tone="amber"
          />
          <StatCard
            title="Current streak"
            value={`${summary.currentStreak} days`}
            helper="80%+ consistency counts as a streak day"
            icon={Flame}
            tone="rose"
          />
          <StatCard
            title="Weekly average"
            value={`${summary.averageWeeklyConsistency}%`}
            helper={summary.motivationalMessage}
            icon={CalendarDays}
            tone="blue"
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Today’s Meals</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {MEAL_TYPE_ORDER.map((mealType) => {
                const meals = today.meals.meals.filter(
                  (meal) => meal.mealType === mealType
                );
                if (meals.length === 0) {
                  return null;
                }

                return (
                  <section key={mealType}>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {getMealTypeLabel(mealType)}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {meals.map((meal) => (
                        <Button
                          key={meal.id}
                          variant="outline"
                          size="sm"
                          className="h-auto whitespace-normal py-1.5"
                          onClick={() => setSelectedMeal(meal)}
                        >
                          {meal.name}
                        </Button>
                      ))}
                    </div>
                  </section>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checklist Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Meals marked</span>
                  <span>{mealProgress}%</span>
                </div>
                <Progress value={mealProgress} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Groceries bought</span>
                  <span>{groceryProgress}%</span>
                </div>
                <Progress value={groceryProgress} />
              </div>
              <div className="rounded-lg bg-muted/60 p-4">
                <p className="text-sm font-medium">Tomorrow Prep</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Day {today.tomorrowGroceries.dayNumber} has{" "}
                  {today.tomorrowGroceries.items.length} grocery items ready to
                  review.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MealDetailDialog
        meal={selectedMeal}
        dayNumber={today.activePlanDay}
        open={Boolean(selectedMeal)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMeal(null);
          }
        }}
      />
    </>
  );
}
