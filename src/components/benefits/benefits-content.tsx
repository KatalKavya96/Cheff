import { HeartPulse, Sparkles, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BENEFIT_CATEGORIES,
  DIET_PLAN,
  GOAL_FOOD_GROUPS,
  GYM_TIPS,
  IMPORTANT_INGREDIENT_BENEFITS,
  POWER_FOOD_GROUPS
} from "@/features/diet/data/diet-plan";

export function BenefitsContent() {
  const uniqueMeals = Array.from(
    new Map(
      DIET_PLAN.flatMap((day) => day.meals).map((meal) => [meal.name, meal])
    ).values()
  );

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {BENEFIT_CATEGORIES.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-primary" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {category.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {POWER_FOOD_GROUPS.map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle>{group.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex flex-wrap gap-2">
                {group.foods.map((food) => (
                  <Badge key={food} variant="secondary">
                    {food}
                  </Badge>
                ))}
              </div>
              {"note" in group && group.note ? (
                <p className="rounded-lg bg-muted/60 p-3 text-sm leading-6 text-muted-foreground">
                  {group.note}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Best Foods For Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {GOAL_FOOD_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="mb-2 text-sm font-semibold">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.foods.map((food) => (
                    <Badge key={food} variant="outline">
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Gym Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3">
              {GYM_TIPS.map((tip) => (
                <li key={tip} className="flex gap-3 text-sm leading-6">
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold tracking-normal">
          Important Ingredient Benefits
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {IMPORTANT_INGREDIENT_BENEFITS.map((item) => (
            <Card key={item.name}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.benefit}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold tracking-normal">
          Dish Benefits
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {uniqueMeals.map((meal) => (
            <Card key={meal.name}>
              <CardHeader>
                <CardTitle>{meal.name}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex flex-wrap gap-2">
                  {meal.tags.map((tag) => (
                    <Badge key={tag} variant="success">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <ul className="grid gap-2">
                  {meal.benefits.map((benefit) => (
                    <li key={benefit} className="text-sm leading-6 text-muted-foreground">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}