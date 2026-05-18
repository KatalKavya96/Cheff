"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";

import { fetchApi } from "@/components/shared/api-client";
import { LoadingGrid } from "@/components/shared/loading-grid";
import { DayCard } from "@/components/plan/day-card";
import { MealDetailDialog } from "@/components/plan/meal-detail-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  DietDayWithStats,
  MealTag,
  MealWithLog
} from "@/features/diet/types/diet";

const filterTags: Array<MealTag | "All"> = [
  "All",
  "High Protein",
  "Iron Boost",
  "Muscle Gain",
  "Energy",
  "Hair Health",
  "Skin Glow",
  "Recovery"
];

export function PlanClient() {
  const [days, setDays] = useState<DietDayWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<(typeof filterTags)[number]>("All");
  const [selectedMeal, setSelectedMeal] = useState<MealWithLog | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchApi<DietDayWithStats[]>("/api/diet/days")
      .then((data) => {
        if (mounted) {
          setDays(data);
          setError(null);
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
  }, []);

  const filteredDays = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return days
      .map((day) => {
        const meals = day.meals.filter((meal) => {
          const matchesQuery =
            normalizedQuery.length === 0 ||
            meal.name.toLowerCase().includes(normalizedQuery) ||
            meal.ingredients.some((ingredient) =>
              ingredient.toLowerCase().includes(normalizedQuery)
            );
          const matchesTag = tag === "All" || meal.tags.includes(tag);
          return matchesQuery && matchesTag;
        });

        return { ...day, meals };
      })
      .filter((day) => day.meals.length > 0);
  }, [days, query, tag]);

  if (loading) {
    return <LoadingGrid />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by dish or ingredient"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
          {filterTags.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={tag === item ? "default" : "outline"}
              onClick={() => setTag(item)}
              className="shrink-0"
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredDays.map((day) => (
          <DayCard
            key={day.id}
            day={day}
            onMealClick={(meal, dayNumber) => {
              setSelectedMeal(meal);
              setSelectedDay(dayNumber);
            }}
          />
        ))}
      </div>

      <MealDetailDialog
        meal={selectedMeal}
        dayNumber={selectedDay}
        open={Boolean(selectedMeal)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMeal(null);
            setSelectedDay(null);
          }
        }}
      />
    </>
  );
}
