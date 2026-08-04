"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeAts } from "@/features/ats/agent";
import { resumeContentSchema } from "@/features/resume/schema";

export interface AnalyzeAtsResult {
  success: boolean;
  message?: string;
}

export async function analyzeAtsAction(applicationId: string): Promise<AnalyzeAtsResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "You need to be signed in." };
  }
  const userId = session.user.id;

  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
    include: { job: true, resume: true },
  });
  if (!application) {
    return { success: false, message: "Application not found." };
  }
  if (!application.resume) {
    return { success: false, message: "Generate a resume for this application first." };
  }

  const parsedResume = resumeContentSchema.safeParse(application.resume.content);
  if (!parsedResume.success) {
    return { success: false, message: "This resume has no content to analyze yet." };
  }

  const analysis = analyzeAts(application.job.description, parsedResume.data);

  const atsReport = await prisma.atsReport.create({
    data: {
      resumeId: application.resume.id,
      score: analysis.score,
      missingKeywords: analysis.missingKeywords,
      keywordDensity: analysis.keywordDensity,
      suggestions: analysis.suggestions,
    },
  });

  await prisma.application.update({
    where: { id: applicationId },
    data: { atsReportId: atsReport.id },
  });

  revalidatePath("/applications");
  revalidatePath("/resume");

  return { success: true };
}
