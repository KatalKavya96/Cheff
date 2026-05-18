import { normalizeDate } from "@/lib/date-cycle";
import { prisma } from "@/lib/prisma";

export const DEFAULT_USER_EMAIL = "gym@diet.local";

export async function getDefaultUser() {
  const today = normalizeDate(new Date());

  const user = await prisma.user.upsert({
    where: { email: DEFAULT_USER_EMAIL },
    update: {},
    create: {
      email: DEFAULT_USER_EMAIL,
      name: "Gym Diet User",
      planStartDate: today,
      preferences: {
        vegetarian: true,
        goal: "Muscle gain, clean weight gain, energy, skin, hair, and recovery"
      }
    }
  });

  if (!user.planStartDate) {
    return prisma.user.update({
      where: { id: user.id },
      data: { planStartDate: today }
    });
  }

  return user;
}

export async function getSettings() {
  const user = await getDefaultUser();

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    planStartDate: user.planStartDate?.toISOString() ?? null,
    preferences: user.preferences
  };
}

export async function updatePlanStartDate(planStartDate: Date) {
  const user = await getDefaultUser();
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      planStartDate: normalizeDate(planStartDate)
    }
  });

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    planStartDate: updatedUser.planStartDate?.toISOString() ?? null
  };
}
