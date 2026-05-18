"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Save, Utensils } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { fetchApi } from "@/components/shared/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  MealStatusValue,
  MealWithLog,
  ProgressStats
} from "@/features/diet/types/diet";
import {
  MEAL_TYPE_ORDER,
  getMealTypeLabel
} from "@/features/diet/utils/meal-format";

type MealsTodayPayload = {
  date: string;
  cycleDayNumber: number;
  dayTitle: string | null;
  meals: MealWithLog[];
  progress: ProgressStats;
};

const statusOptions: Array<{ value: MealStatusValue; label: string }> = [
  { value: "NOT_MARKED", label: "Not marked" },
  { value: "ATE", label: "Ate as planned" },
  { value: "SKIPPED", label: "Skipped" },
  { value: "REPLACED", label: "Replaced" }
];

const trackerSchema = z.object({
  meals: z.array(
    z.object({
      mealId: z.string(),
      status: z.enum(["NOT_MARKED", "ATE", "SKIPPED", "REPLACED"]),
      notes: z.string().max(600).optional()
    })
  )
});

type TrackerFormValues = z.infer<typeof trackerSchema>;

export function TrackerClient() {
  const [data, setData] = useState<MealsTodayPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TrackerFormValues>({
    resolver: zodResolver(trackerSchema),
    defaultValues: { meals: [] }
  });
  const { reset } = form;

  const loadMeals = () => {
    setLoading(true);
    fetchApi<MealsTodayPayload>("/api/meals/today")
      .then((payload) => {
        setData(payload);
        setError(null);
        reset({
          meals: payload.meals.map((meal) => ({
            mealId: meal.id,
            status: meal.status,
            notes: meal.notes ?? ""
          }))
        });
      })
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let mounted = true;

    fetchApi<MealsTodayPayload>("/api/meals/today")
      .then((payload) => {
        if (mounted) {
          setData(payload);
          setError(null);
          reset({
            meals: payload.meals.map((meal) => ({
              mealId: meal.id,
              status: meal.status,
              notes: meal.notes ?? ""
            }))
          });
        }
      })
      .catch((requestError: Error) => {
        if (mounted) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [reset]);

  const mealIndexById = useMemo(() => {
    return new Map(data?.meals.map((meal, index) => [meal.id, index]) ?? []);
  }, [data?.meals]);

  async function onSubmit(values: TrackerFormValues) {
    try {
      await Promise.all(
        values.meals.map((meal) =>
          fetchApi<MealWithLog>("/api/meals/log", {
            method: "POST",
            body: JSON.stringify({
              mealId: meal.mealId,
              status: meal.status,
              notes: meal.notes ?? "",
              date: data?.date
            })
          })
        )
      );
      toast.success("Meal tracking saved");
      loadMeals();
    } catch (requestError) {
      toast.error(requestError instanceof Error ? requestError.message : "Save failed");
    }
  }

  async function resetToday() {
    try {
      await fetchApi<MealsTodayPayload>("/api/meals/today", { method: "DELETE" });
      toast.success("Today’s tracking reset");
      loadMeals();
    } catch (requestError) {
      toast.error(requestError instanceof Error ? requestError.message : "Reset failed");
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (loading || !data) {
    return <div className="h-72 animate-pulse rounded-lg bg-muted" />;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="secondary">{data.date}</Badge>
              <Badge>Day {data.cycleDayNumber}</Badge>
            </div>
            <h2 className="text-xl font-semibold">{data.dayTitle}</h2>
            <div className="mt-3 max-w-xl">
              <div className="mb-2 flex justify-between text-sm">
                <span>Consistency score</span>
                <span>{data.progress.consistencyPercentage ?? 0}%</span>
              </div>
              <Progress value={data.progress.consistencyPercentage ?? 0} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit">
              <Save className="h-4 w-4" />
              Save all
            </Button>
            <Button type="button" variant="outline" onClick={resetToday}>
              <RotateCcw className="h-4 w-4" />
              Reset today
            </Button>
          </div>
        </CardContent>
      </Card>

      {MEAL_TYPE_ORDER.map((mealType) => {
        const meals = data.meals.filter((meal) => meal.mealType === mealType);
        if (meals.length === 0) {
          return null;
        }

        return (
          <Card key={mealType}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" />
                {getMealTypeLabel(mealType)}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {meals.map((meal) => {
                const index = mealIndexById.get(meal.id);
                if (index === undefined) {
                  return null;
                }

                return (
                  <div key={meal.id} className="grid gap-3 rounded-lg border p-4 lg:grid-cols-[1fr_220px_1fr]">
                    <div>
                      <p className="font-medium">{meal.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {meal.tags.slice(0, 3).join(" • ")}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label>Status</Label>
                      <Controller
                        control={form.control}
                        name={`meals.${index}.status`}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) =>
                              field.onChange(value as MealStatusValue)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`notes-${meal.id}`}>Notes</Label>
                      <Textarea
                        id={`notes-${meal.id}`}
                        placeholder="Optional replacement or timing notes"
                        {...form.register(`meals.${index}.notes`)}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </form>
  );
}
