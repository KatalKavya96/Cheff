"use client";

import { Calendar, CheckCircle2, ShoppingBasket } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DietDayWithStats, MealWithLog } from "@/features/diet/types/diet";
import {
  MEAL_TYPE_ORDER,
  getMealTypeLabel
} from "@/features/diet/utils/meal-format";

type DayCardProps = {
  day: DietDayWithStats;
  onMealClick: (meal: MealWithLog, dayNumber: number) => void;
};

export function DayCard({ day, onMealClick }: DayCardProps) {
  const mealCompletion = day.mealProgress.consistencyPercentage ?? 0;
  const groceryCompletion = day.groceryProgress.completionPercentage ?? 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="secondary" className="mb-2">
              Day {day.dayNumber}
            </Badge>
            <CardTitle>{day.title ?? `Day ${day.dayNumber}`}</CardTitle>
          </div>
          <div className="rounded-md bg-accent p-2 text-accent-foreground">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Meal completion
              </span>
              <span>{mealCompletion}%</span>
            </div>
            <Progress value={mealCompletion} />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShoppingBasket className="h-3.5 w-3.5" />
                Grocery completion
              </span>
              <span>{groceryCompletion}%</span>
            </div>
            <Progress value={groceryCompletion} />
          </div>
        </div>

        <div className="grid gap-4">
          {MEAL_TYPE_ORDER.map((mealType) => {
            const meals = day.meals.filter((meal) => meal.mealType === mealType);
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
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-auto max-w-full justify-start whitespace-normal py-1.5 text-left"
                      onClick={() => onMealClick(meal, day.dayNumber)}
                    >
                      {meal.name}
                    </Button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
