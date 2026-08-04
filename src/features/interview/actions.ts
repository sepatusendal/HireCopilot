"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInterviewPrepForApplication } from "@/features/interview/agent";

export interface GenerateInterviewPrepResult {
  success: boolean;
  message?: string;
}

export async function generateInterviewPrepAction(applicationId: string): Promise<GenerateInterviewPrepResult> {
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
    include: { skills: true, experiences: true },
  });
  if (!profile) {
    return {
      success: false,
      message: "Add your profile in Settings first — the Interview Copilot needs it to write something real.",
    };
  }

  let content: Awaited<ReturnType<typeof generateInterviewPrepForApplication>>;
  try {
    content = await generateInterviewPrepForApplication(application.job, profile);
  } catch (error) {
    console.error(`Failed to generate interview prep for application ${applicationId}:`, error);
    return {
      success: false,
      message: "The AI provider timed out or is temporarily unavailable. Try again in a moment.",
    };
  }

  const label = `${application.job.title} @ ${application.job.company.name}`;

  if (application.interviewPrepId) {
    await prisma.interviewPrep.update({
      where: { id: application.interviewPrepId },
      data: { content, label },
    });
  } else {
    const interviewPrep = await prisma.interviewPrep.create({
      data: { userId, label, content },
    });
    await prisma.application.update({
      where: { id: applicationId },
      data: { interviewPrepId: interviewPrep.id },
    });
  }

  revalidatePath("/applications");
  revalidatePath("/interview");

  return { success: true };
}
