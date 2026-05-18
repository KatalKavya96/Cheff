"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ListChecks, ShoppingBasket } from "lucide-react";
import { toast } from "sonner";

import { fetchApi } from "@/components/shared/api-client";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { GroceryWithLog, ProgressStats } from "@/features/diet/types/diet";

type GroceryPayload = {
  scope: "today" | "tomorrow" | "day" | "week";
  dayNumber: number | null;
  date: string | null;
  items: GroceryWithLog[];
  progress: ProgressStats;
};

type GroceryMode = "today" | "tomorrow" | "day" | "week";

const modes: Array<{ value: GroceryMode; label: string }> = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "day", label: "Selected day" },
  { value: "week", label: "Full week" }
];

export function GroceryClient() {
  const [mode, setMode] = useState<GroceryMode>("today");
  const [selectedDay, setSelectedDay] = useState("1");
  const [payload, setPayload] = useState<GroceryPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(() => {
    if (mode === "today") {
      return "/api/grocery/today";
    }
    if (mode === "tomorrow") {
      return "/api/grocery/tomorrow";
    }
    if (mode === "day") {
      return `/api/grocery?dayNumber=${selectedDay}`;
    }
    return "/api/grocery?scope=week";
  }, [mode, selectedDay]);

  const loadGroceries = useCallback((showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    fetchApi<GroceryPayload>(endpoint)
      .then((data) => {
        setPayload(data);
        setError(null);
      })
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    let mounted = true;

    fetchApi<GroceryPayload>(endpoint)
      .then((data) => {
        if (mounted) {
          setPayload(data);
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
  }, [endpoint]);

  async function toggleItem(item: GroceryWithLog, completed: boolean) {
    try {
      if (item.logId) {
        await fetchApi<GroceryWithLog>(`/api/grocery/log/${item.logId}`, {
          method: "PATCH",
          body: JSON.stringify({ completed })
        });
      } else {
        await fetchApi<GroceryWithLog>("/api/grocery/log", {
          method: "POST",
          body: JSON.stringify({
            groceryItemId: item.id,
            completed,
            date: item.targetDate
          })
        });
      }
      toast.success(completed ? "Marked as bought" : "Marked as pending");
      loadGroceries();
    } catch (requestError) {
      toast.error(requestError instanceof Error ? requestError.message : "Update failed");
    }
  }

  const groupedItems = useMemo(() => {
    const groups = new Map<number, GroceryWithLog[]>();
    for (const item of payload?.items ?? []) {
      const day = item.cycleDayNumber;
      groups.set(day, [...(groups.get(day) ?? []), item]);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a - b);
  }, [payload?.items]);

  return (
    <div className="grid gap-5">
      <Card>
        <CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <div className="flex flex-wrap gap-2">
            {modes.map((item) => (
              <Button
                key={item.value}
                type="button"
                size="sm"
                variant={mode === item.value ? "default" : "outline"}
                onClick={() => setMode(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          {mode === "day" ? (
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue placeholder="Choose day" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 7 }).map((_, index) => (
                  <SelectItem key={index + 1} value={`${index + 1}`}>
                    Day {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          <Button type="button" variant="outline" onClick={() => loadGroceries()}>
            <ListChecks className="h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="h-72 animate-pulse rounded-lg bg-muted" />
      ) : payload ? (
        <>
          <div className="metric-grid">
            <StatCard
              title="Total items"
              value={payload.progress.totalItems ?? 0}
              helper={payload.date ? `For ${payload.date}` : "Across the active week"}
              icon={ShoppingBasket}
              tone="blue"
            />
            <StatCard
              title="Bought"
              value={payload.progress.boughtItems ?? 0}
              helper="Checked items"
              icon={CheckCircle2}
              tone="green"
            />
            <StatCard
              title="Pending"
              value={payload.progress.pendingItems ?? 0}
              helper="Still to buy"
              icon={ListChecks}
              tone="amber"
            />
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-2xl font-bold">
                  {payload.progress.completionPercentage ?? 0}%
                </div>
                <Progress value={payload.progress.completionPercentage ?? 0} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            {groupedItems.map(([dayNumber, items]) => (
              <Card key={dayNumber}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle>Day {dayNumber} Groceries</CardTitle>
                    <Badge variant="secondary">{items.length} items</Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {items.map((item) => (
                    <label
                      key={`${item.targetDate}-${item.id}`}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={(checked) =>
                          toggleItem(item, checked === true)
                        }
                        className="mt-1"
                      />
                      <span className="grid gap-1">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.quantity} • {item.relatedMeal} • {item.relatedDish}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Date: {item.targetDate}
                        </span>
                      </span>
                    </label>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
