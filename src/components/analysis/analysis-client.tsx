"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Flame,
  LineChart as LineChartIcon,
  PieChart,
  Utensils
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { fetchApi } from "@/components/shared/api-client";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type {
  AnalysisSummary,
  ConsistencyPoint
} from "@/features/analysis/types/analysis";
import { getMealTypeLabel } from "@/features/diet/utils/meal-format";

export function AnalysisClient() {
  const [series, setSeries] = useState<ConsistencyPoint[]>([]);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetchApi<ConsistencyPoint[]>("/api/analysis/consistency?days=30"),
      fetchApi<AnalysisSummary>("/api/analysis/summary")
    ])
      .then(([seriesData, summaryData]) => {
        if (mounted) {
          setSeries(seriesData);
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

  if (!summary) {
    return <div className="h-72 animate-pulse rounded-lg bg-muted" />;
  }

  return (
    <div className="grid gap-5">
      <div className="metric-grid">
        <StatCard
          title="Last 7 days"
          value={`${summary.last7DaysConsistency}%`}
          helper="Average consistency"
          icon={LineChartIcon}
          tone="green"
        />
        <StatCard
          title="Last 30 days"
          value={`${summary.last30DaysConsistency}%`}
          helper="Longer trend"
          icon={BarChart3}
          tone="blue"
        />
        <StatCard
          title="Current streak"
          value={`${summary.currentStreak} days`}
          helper={`Best streak: ${summary.bestStreak} days`}
          icon={Flame}
          tone="rose"
        />
        <StatCard
          title="Most missed"
          value={summary.mostMissedMealType ?? "None"}
          helper="Based on skipped logs"
          icon={Utensils}
          tone="amber"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Daily Consistency</CardTitle>
            <Badge variant="secondary">Ate = 1, Replaced = 0.5, Skipped = 0</Badge>
          </div>
        </CardHeader>
        <CardContent className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ left: 0, right: 12, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickMargin={10}
                minTickGap={20}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, "Consistency"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="consistencyPercentage"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Meal Totals
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex justify-between rounded-md border px-3 py-2 text-sm">
              <span>Planned</span>
              <strong>{summary.totalMealsPlanned}</strong>
            </div>
            <div className="flex justify-between rounded-md border px-3 py-2 text-sm">
              <span>Ate as planned</span>
              <strong>{summary.totalMealsEaten}</strong>
            </div>
            <div className="flex justify-between rounded-md border px-3 py-2 text-sm">
              <span>Skipped</span>
              <strong>{summary.totalMealsSkipped}</strong>
            </div>
            <div className="flex justify-between rounded-md border px-3 py-2 text-sm">
              <span>Replaced</span>
              <strong>{summary.totalMealsReplaced}</strong>
            </div>
            <p className="rounded-lg bg-muted/60 p-3 text-sm leading-6 text-muted-foreground">
              {summary.motivationalMessage}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meal-wise Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {summary.mealWiseBreakdown.map((item) => (
              <div key={item.mealType} className="grid gap-2">
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="font-medium">{getMealTypeLabel(item.mealType)}</span>
                  <span className="text-muted-foreground">
                    {item.consistencyPercentage}% • {item.ate} ate • {item.replaced} replaced •{" "}
                    {item.skipped} skipped
                  </span>
                </div>
                <Progress value={item.consistencyPercentage} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
