"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reorderPortfolioForApplication } from "@/features/portfolio/agent";

export interface ReorderPortfolioResult {
  success: boolean;
  message?: string;
}

export async function reorderPortfolioAction(applicationId: string): Promise<ReorderPortfolioResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "You need to be signed in." };
  }
  const userId = session.user.id;

  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
    include: { job: { include: { company: true } } },
  });
  if (!application) {
    return { success: false, message: "Application not found." };
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { skills: true, experiences: true, projects: { orderBy: { order: "asc" } } },
  });
  if (!profile) {
    return {
      success: false,
      message: "Add your profile and projects in Settings first — the Portfolio Agent needs them to reorder.",
    };
  }
  if (profile.projects.length === 0) {
    return { success: false, message: "Add at least one project in Settings before reordering your portfolio." };
  }

  let content: Awaited<ReturnType<typeof reorderPortfolioForApplication>>;
  try {
    content = await reorderPortfolioForApplication(application.job, profile);
  } catch (error) {
    console.error(`Failed to reorder portfolio for application ${applicationId}:`, error);
    return {
      success: false,
      message: "The AI provider timed out or is temporarily unavailable. Try again in a moment.",
    };
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { portfolioOrder: content },
  });

  revalidatePath("/applications");

  return { success: true };
}
