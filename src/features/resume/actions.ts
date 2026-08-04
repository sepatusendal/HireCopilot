"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateResumeForApplication } from "@/features/resume/agent";
import { resumeContentSchema } from "@/features/resume/schema";
import { resumeHtmlTemplate } from "@/features/resume/pdf-template";
import { renderHtmlToPdf } from "@/lib/pdf";
import { uploadDocument } from "@/lib/storage";

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

export interface ExportResumePdfResult {
  success: boolean;
  message?: string;
  fileUrl?: string;
}

export async function exportResumePdfAction(resumeId: string): Promise<ExportResumePdfResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "You need to be signed in." };
  }

  const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId: session.user.id } });
  if (!resume) {
    return { success: false, message: "Resume not found." };
  }

  const parsed = resumeContentSchema.safeParse(resume.content);
  if (!parsed.success) {
    return { success: false, message: "This resume has no content to export yet." };
  }

  let fileUrl: string;
  try {
    const html = resumeHtmlTemplate(resume.label, parsed.data);
    const pdf = await renderHtmlToPdf(html);
    fileUrl = await uploadDocument(`resumes/${resume.id}.pdf`, pdf, "application/pdf");
  } catch (error) {
    console.error(`Failed to export resume ${resumeId} to PDF:`, error);
    return { success: false, message: "PDF export failed. Check that Supabase Storage and Chrome are configured." };
  }

  await prisma.resume.update({ where: { id: resumeId }, data: { fileUrl } });
  revalidatePath("/resume");

  return { success: true, fileUrl };
}
