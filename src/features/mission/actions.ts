"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateDailyBriefing } from "@/features/mission/agent";

export interface GenerateBriefingResult {
  success: boolean;
  message?: string;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function generateDailyBriefingAction(): Promise<GenerateBriefingResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "You need to be signed in." };
  }
  const userId = session.user.id;

  const [applications, latestInsight] = await Promise.all([
    prisma.application.findMany({ where: { userId } }),
    prisma.insight.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  const summary = generateDailyBriefing(session.user.name, applications, latestInsight);
  const date = startOfToday();

  await prisma.dailyBriefing.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, summary: summary as unknown as Prisma.InputJsonValue },
    update: { summary: summary as unknown as Prisma.InputJsonValue },
  });

  revalidatePath("/mission");
  revalidatePath("/dashboard");

  return { success: true };
}
