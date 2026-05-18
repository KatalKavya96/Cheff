"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { fetchApi } from "@/components/shared/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SettingsPayload = {
  id: string;
  name: string | null;
  email: string;
  planStartDate: string | null;
  preferences: unknown;
};

const settingsSchema = z.object({
  planStartDate: z.string().min(1, "Plan start date is required")
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

function toDateInputValue(value: string | null) {
  return value ? value.slice(0, 10) : new Date().toISOString().slice(0, 10);
}

export function SettingsClient() {
  const [settings, setSettings] = useState<SettingsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      planStartDate: new Date().toISOString().slice(0, 10)
    }
  });

  useEffect(() => {
    let mounted = true;
    fetchApi<SettingsPayload>("/api/settings")
      .then((payload) => {
        if (mounted) {
          setSettings(payload);
          form.reset({ planStartDate: toDateInputValue(payload.planStartDate) });
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
  }, [form]);

  async function onSubmit(values: SettingsFormValues) {
    try {
      const updated = await fetchApi<SettingsPayload>(
        "/api/settings/plan-start-date",
        {
          method: "PATCH",
          body: JSON.stringify({ planStartDate: values.planStartDate })
        }
      );
      setSettings((current) =>
        current ? { ...current, planStartDate: updated.planStartDate } : current
      );
      toast.success("Plan start date updated");
    } catch (requestError) {
      toast.error(requestError instanceof Error ? requestError.message : "Update failed");
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            Plan Start Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="planStartDate">Start date</Label>
              <Input
                id="planStartDate"
                type="date"
                {...form.register("planStartDate")}
              />
              {form.formState.errors.planStartDate ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.planStartDate.message}
                </p>
              ) : null}
            </div>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <Save className="h-4 w-4" />
              Save start date
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracking Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="flex justify-between rounded-md border px-3 py-2">
            <span className="text-muted-foreground">User</span>
            <strong>{settings?.name ?? "Gym Diet User"}</strong>
          </div>
          <div className="flex justify-between rounded-md border px-3 py-2">
            <span className="text-muted-foreground">Email</span>
            <strong>{settings?.email ?? "gym@diet.local"}</strong>
          </div>
          <div className="flex justify-between rounded-md border px-3 py-2">
            <span className="text-muted-foreground">Current start</span>
            <strong>{toDateInputValue(settings?.planStartDate ?? null)}</strong>
          </div>
          <p className="rounded-lg bg-muted/60 p-4 leading-6 text-muted-foreground">
            The diet cycle repeats continuously: Day 1 through Day 7, then back
            to Day 1. Dashboard, Today, Grocery, Tracker, and Analysis all use
            this date to map the active plan day.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
