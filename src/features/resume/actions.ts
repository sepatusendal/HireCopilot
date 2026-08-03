"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateResumeForApplication } from "@/features/resume/agent";

export interface GenerateResumeResult {
  success: boolean;
  message?: string;
}

export async function generateResumeAction(applicationId: string): Promise<GenerateResumeResult> {
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
      message: "Add your profile in Settings first — the Resume Agent needs it to write something real.",
    };
  }

  let content: Awaited<ReturnType<typeof generateResumeForApplication>>;
  try {
    content = await generateResumeForApplication(application.job, profile);
  } catch (error) {
    console.error(`Failed to generate resume for application ${applicationId}:`, error);
    return {
      success: false,
      message: "The AI provider timed out or is temporarily unavailable. Try again in a moment.",
    };
  }

  const label = `${application.job.title} @ ${application.job.company.name}`;

  if (application.resumeId) {
    await prisma.resume.update({
      where: { id: application.resumeId },
      data: { content, label },
    });
  } else {
    const resume = await prisma.resume.create({
      data: { userId, label, content },
    });
    await prisma.application.update({
      where: { id: applicationId },
      data: { resumeId: resume.id },
    });
  }

  revalidatePath("/applications");
  revalidatePath("/resume");

  return { success: true };
}
