"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import type { MealWithLog } from "@/features/diet/types/diet";
import { getMealTypeLabel } from "@/features/diet/utils/meal-format";

type MealDetailDialogProps = {
  meal: MealWithLog | null;
  dayNumber: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MealDetailDialog({
  meal,
  dayNumber,
  open,
  onOpenChange
}: MealDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {meal ? (
          <>
            <DialogHeader>
              <div className="flex flex-wrap gap-2">
                {dayNumber ? <Badge variant="secondary">Day {dayNumber}</Badge> : null}
                <Badge variant="outline">{getMealTypeLabel(meal.mealType)}</Badge>
              </div>
              <DialogTitle className="pt-2 text-2xl">{meal.name}</DialogTitle>
              {meal.description ? (
                <DialogDescription>{meal.description}</DialogDescription>
              ) : null}
            </DialogHeader>

            <div className="grid gap-5">
              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {meal.tags.map((tag) => (
                    <Badge key={tag} variant="success">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">Ingredients</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {meal.ingredients.map((ingredient) => (
                    <li
                      key={ingredient}
                      className="rounded-md border bg-muted/40 px-3 py-2 text-sm"
                    >
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">Recipe / Preparation</h3>
                <ol className="grid gap-2">
                  {meal.recipeSteps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm leading-6">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <h3 className="mb-2 font-semibold">Benefits & Key Gains</h3>
                <ul className="grid gap-2">
                  {meal.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="rounded-md border-l-4 border-primary bg-primary/5 px-3 py-2 text-sm leading-6"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
