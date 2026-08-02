"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCoverLetterForApplication } from "@/features/cover-letter/agent";

export interface GenerateCoverLetterResult {
  success: boolean;
  message?: string;
}

export async function generateCoverLetterAction(applicationId: string): Promise<GenerateCoverLetterResult> {
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
      message: "Add your profile in Settings first — the Cover Letter Agent needs it to write something real.",
    };
  }

  let content: string;
  try {
    content = await generateCoverLetterForApplication(application.job, profile);
  } catch (error) {
    console.error(`Failed to generate cover letter for application ${applicationId}:`, error);
    return {
      success: false,
      message: "The AI provider timed out or is temporarily unavailable. Try again in a moment.",
    };
  }

  const label = `${application.job.title} @ ${application.job.company.name}`;

  if (application.coverLetterId) {
    await prisma.coverLetter.update({
      where: { id: application.coverLetterId },
      data: { content, label },
    });
  } else {
    const coverLetter = await prisma.coverLetter.create({
      data: { userId, label, content },
    });
    await prisma.application.update({
      where: { id: applicationId },
      data: { coverLetterId: coverLetter.id },
    });
  }

  revalidatePath("/applications");
  revalidatePath("/cover-letter");

  return { success: true };
}
