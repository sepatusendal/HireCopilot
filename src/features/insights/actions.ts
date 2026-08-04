"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInsights } from "@/features/insights/agent";

export interface RefreshInsightsResult {
  success: boolean;
  message?: string;
}

export async function refreshInsightsAction(): Promise<RefreshInsightsResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "You need to be signed in." };
  }
  const userId = session.user.id;

  const [applications, profile] = await Promise.all([
    prisma.application.findMany({ where: { userId }, include: { job: true } }),
    prisma.profile.findUnique({ where: { userId }, include: { skills: true } }),
  ]);

  if (applications.length === 0) {
    return { success: false, message: "Score a few jobs on Discover first — insights need match data to work with." };
  }

  const insights = generateInsights(applications, profile);

  await prisma.$transaction([
    prisma.insight.deleteMany({ where: { userId } }),
    ...insights.map((insight) =>
      prisma.insight.create({ data: { userId, ...insight, data: insight.data as Prisma.InputJsonValue } })
    ),
  ]);

  revalidatePath("/ai-insights");

  return { success: true };
}
