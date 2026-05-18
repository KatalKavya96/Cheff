-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'MID_MORNING', 'LUNCH', 'PRE_WORKOUT', 'POST_WORKOUT', 'DINNER', 'BEFORE_SLEEP');

-- CreateEnum
CREATE TYPE "MealStatus" AS ENUM ('NOT_MARKED', 'ATE', 'SKIPPED', 'REPLACED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "planStartDate" TIMESTAMP(3),
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietDay" (
    "id" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DietDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "dietDayId" TEXT NOT NULL,
    "mealType" "MealType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "ingredients" JSONB NOT NULL,
    "recipeSteps" JSONB NOT NULL,
    "benefits" JSONB NOT NULL,
    "tags" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cycleDayNumber" INTEGER NOT NULL,
    "mealType" "MealType" NOT NULL,
    "status" "MealStatus" NOT NULL DEFAULT 'NOT_MARKED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroceryItem" (
    "id" TEXT NOT NULL,
    "dietDayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" TEXT,
    "relatedMeal" TEXT,
    "relatedDish" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroceryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroceryLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groceryItemId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cycleDayNumber" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroceryLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DietDay_dayNumber_key" ON "DietDay"("dayNumber");

-- CreateIndex
CREATE INDEX "Meal_dietDayId_mealType_idx" ON "Meal"("dietDayId", "mealType");

-- CreateIndex
CREATE INDEX "MealLog_userId_date_idx" ON "MealLog"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MealLog_userId_mealId_date_key" ON "MealLog"("userId", "mealId", "date");

-- CreateIndex
CREATE INDEX "GroceryItem_dietDayId_idx" ON "GroceryItem"("dietDayId");

-- CreateIndex
CREATE INDEX "GroceryLog_userId_date_idx" ON "GroceryLog"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "GroceryLog_userId_groceryItemId_date_key" ON "GroceryLog"("userId", "groceryItemId", "date");

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_dietDayId_fkey" FOREIGN KEY ("dietDayId") REFERENCES "DietDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealLog" ADD CONSTRAINT "MealLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealLog" ADD CONSTRAINT "MealLog_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroceryItem" ADD CONSTRAINT "GroceryItem_dietDayId_fkey" FOREIGN KEY ("dietDayId") REFERENCES "DietDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroceryLog" ADD CONSTRAINT "GroceryLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroceryLog" ADD CONSTRAINT "GroceryLog_groceryItemId_fkey" FOREIGN KEY ("groceryItemId") REFERENCES "GroceryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
