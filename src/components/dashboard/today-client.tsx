"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Dumbbell, Leaf, ShoppingBasket } from "lucide-react";

import { fetchApi } from "@/components/shared/api-client";
import { MealDetailDialog } from "@/components/plan/meal-detail-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
    dayTitle: string | null;
    meals: MealWithLog[];
    progress: ProgressStats;
  };
  groceries: {
    items: GroceryWithLog[];
    progress: ProgressStats;
  };
  tomorrowGroceries: {
    dayNumber: number;
    items: GroceryWithLog[];
  };
};

export function TodayClient() {
  const [data, setData] = useState<TodayPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealWithLog | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchApi<TodayPayload>("/api/diet/today")
      .then((payload) => {
        if (mounted) {
          setData(payload);
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

  if (!data) {
    return <div className="h-72 animate-pulse rounded-lg bg-muted" />;
  }

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{data.currentDate}</Badge>
              <Badge>Day {data.activePlanDay}</Badge>
            </div>
            <CardTitle className="pt-2">{data.meals.dayTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-3 rounded-lg bg-muted/50 p-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Dumbbell className="h-4 w-4 text-primary" />
                  Today’s Focus
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  Keep protein anchored, use carbs around training, and add lemon
                  or vitamin C near iron-rich meals.
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <ShoppingBasket className="h-4 w-4 text-primary" />
                  Tomorrow Prep
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  Day {data.tomorrowGroceries.dayNumber} needs{" "}
                  {data.tomorrowGroceries.items.length} grocery items. Check the
                  planner before the day gets noisy.
                </p>
              </div>
            </div>

            {MEAL_TYPE_ORDER.map((mealType) => {
              const meals = data.meals.meals.filter(
                (meal) => meal.mealType === mealType
              );
              if (meals.length === 0) {
                return null;
              }

              return (
                <section key={mealType} className="rounded-lg border p-4">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Leaf className="h-4 w-4 text-primary" />
                    {getMealTypeLabel(mealType)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {meals.map((meal) => (
                      <Button
                        key={meal.id}
                        type="button"
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

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Today’s Progress</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Meal consistency</span>
                  <span>{data.meals.progress.consistencyPercentage ?? 0}%</span>
                </div>
                <Progress value={data.meals.progress.consistencyPercentage ?? 0} />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Grocery checklist</span>
                  <span>{data.groceries.progress.completionPercentage ?? 0}%</span>
                </div>
                <Progress value={data.groceries.progress.completionPercentage ?? 0} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grocery Preview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {data.groceries.items.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
                >
                  <span>{item.name}</span>
                  <span className="text-muted-foreground">{item.quantity}</span>
                </div>
              ))}
              <Button asChild variant="outline">
                <a href="/grocery">
                  Open full grocery planner
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <MealDetailDialog
        meal={selectedMeal}
        dayNumber={data.activePlanDay}
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
