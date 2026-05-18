# Diet Plan Tracker

A production-ready Next.js App Router web app for a repeating 7-day pure vegetarian gym diet plan. It includes plan browsing, meal details, grocery checklists, meal tracking, benefits, settings, and consistency analysis.

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS + ShadCN-style UI primitives
- Prisma ORM + MySQL
- Recharts
- React Hook Form + Zod
- Lucide React icons

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from the example:

```bash
cp .env.example .env
```

3. Set your MySQL connection:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/diet_tracker"
```

4. Generate Prisma Client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

5. Seed the full 7-day diet plan:

```bash
npx prisma db seed
```

6. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

```bash
npm run lint
npm run build
npm audit
npx prisma validate
npx prisma studio
```

## Features

- Dashboard with active diet day, today’s meals, grocery progress, meal progress, streaks, and weekly average.
- 7-day plan grid with every meal grouped by breakfast, mid morning, lunch, pre-workout, post-workout, dinner, and before sleep.
- Meal detail modal with ingredients, simple recipe steps, benefits, key gains, and tags.
- Grocery planner for today, tomorrow, selected day, and full active week.
- Date-based grocery and meal logs saved in MySQL.
- Meal tracker statuses: not marked, ate as planned, skipped, replaced.
- Analysis page with Recharts line chart and scored consistency formula.
- Benefits page covering dish benefits, important ingredients, gym tips, skin, hair, energy, iron, recovery, and clean bulk.
- Settings page for the plan start date that controls the repeating 7-day cycle.

## Diet Cycle Logic

The diet repeats continuously:

```ts
const daysPassed = differenceInCalendarDays(new Date(), user.planStartDate);
const activePlanDay = (daysPassed % 7) + 1;
```

The implementation uses a safe positive modulo variant so future or adjusted start dates still map correctly.

## Project Structure

```txt
src/
  app/                  App Router pages and API routes
  components/           Layout, feature UI, and shared UI primitives
  features/             Diet, grocery, tracker, and analysis domain logic
  lib/                  Prisma, date-cycle utilities, API helpers
prisma/
  schema.prisma         MySQL schema
  seed.ts               Full 7-day diet plan, meals, details, groceries
```

## Notes

- The app uses a default local user: `gym@diet.local`.
- Run `npx prisma db seed` after migrations before using database-backed pages.
- The seed includes all seven days, all meal windows, meal options, ingredients, benefits, tags, and grocery items.
