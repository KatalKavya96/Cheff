import { PrismaClient, type MealType } from "@prisma/client";

import { DIET_PLAN, GROCERY_PLAN } from "../src/features/diet/data/diet-plan";

const prisma = new PrismaClient();

async function main() {
  await prisma.groceryLog.deleteMany();
  await prisma.mealLog.deleteMany();
  await prisma.groceryItem.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.dietDay.deleteMany();

  for (const day of DIET_PLAN) {
    const dietDay = await prisma.dietDay.create({
      data: {
        dayNumber: day.dayNumber,
        title: day.title
      }
    });

    await prisma.meal.createMany({
      data: day.meals.map((meal, index) => ({
        dietDayId: dietDay.id,
        mealType: meal.mealType as MealType,
        name: meal.name,
        description: meal.description,
        sortOrder: index,
        ingredients: meal.ingredients,
        recipeSteps: meal.recipeSteps,
        benefits: meal.benefits,
        tags: meal.tags
      }))
    });

    const groceryItems = GROCERY_PLAN.filter(
      (item) => item.dayNumber === day.dayNumber
    );

    await prisma.groceryItem.createMany({
      data: groceryItems.map((item, index) => ({
        dietDayId: dietDay.id,
        name: item.name,
        quantity: item.quantity,
        relatedMeal: item.relatedMeal,
        relatedDish: item.relatedDish,
        sortOrder: index
      }))
    });
  }

  await prisma.user.upsert({
    where: { email: "gym@diet.local" },
    update: {},
    create: {
      email: "gym@diet.local",
      name: "Gym Diet User",
      planStartDate: new Date(),
      preferences: {
        vegetarian: true,
        goal: "Muscle gain, clean weight gain, energy, skin, hair, and recovery"
      }
    }
  });

  console.log(`Seeded ${DIET_PLAN.length} diet days with complete meals and groceries.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
