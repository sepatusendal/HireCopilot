"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchArbeitnowJobs } from "@/features/discovery/lib/arbeitnow";
import { matchJobToProfile } from "@/features/match/agent";

// Kept low so a full sync stays inside Vercel Hobby's 60s function budget even
// if a couple of jobs hit the full AI-provider fallback chain. Each match is
// committed to the DB as soon as it's scored, so if the function does get cut
// off mid-batch, progress made so far isn't lost — just click "Sync jobs"
// again to pick up the rest.
const MAX_NEW_MATCHES_PER_SYNC = 3;

export interface SyncJobsState {
  status: "idle" | "success" | "error";
  message?: string;
  matchedCount?: number;
}

export async function syncJobsAction(_prevState: SyncJobsState): Promise<SyncJobsState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { status: "error", message: "You need to be signed in." };
  }
  const userId = session.user.id;

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { skills: true, experiences: true },
  });

  if (!profile) {
    return {
      status: "error",
      message: "Add your profile in Settings first — I need something to compare jobs against.",
    };
  }

  const normalizedJobs = await fetchArbeitnowJobs(30);

  const jobRecords = [];
  for (const nj of normalizedJobs) {
    const company = await prisma.company.upsert({
      where: { name: nj.companyName },
      update: {},
      create: { name: nj.companyName },
    });

    const job = await prisma.job.upsert({
      where: { sourceUrl: nj.sourceUrl },
      update: {},
      create: {
        companyId: company.id,
        title: nj.title,
        description: nj.description,
        location: nj.location,
        isRemote: nj.isRemote,
        workMode: nj.workMode,
        source: "arbeitnow",
        sourceUrl: nj.sourceUrl,
        postedAt: nj.postedAt,
      },
      include: { company: true },
    });

    jobRecords.push(job);
  }

  const existingApplications = await prisma.application.findMany({
    where: { userId, jobId: { in: jobRecords.map((j) => j.id) } },
    select: { jobId: true },
  });
  const alreadyMatchedJobIds = new Set(existingApplications.map((a) => a.jobId));

  const unmatchedJobs = jobRecords
    .filter((j) => !alreadyMatchedJobIds.has(j.id))
    .slice(0, MAX_NEW_MATCHES_PER_SYNC);

  let matchedCount = 0;
  let failedCount = 0;
  for (const job of unmatchedJobs) {
    try {
      const result = await matchJobToProfile(job, profile);
      await prisma.application.create({
        data: {
          userId,
          jobId: job.id,
          status: "NEW",
          matchScore: result.matchScore,
          matchDetails: result,
        },
      });
      matchedCount += 1;
    } catch (error) {
      // One job's AI call failing (rate limit, transient provider error) shouldn't
      // block the rest of the batch — log and move on, report the shortfall to the user.
      console.error(`Failed to match job ${job.id}:`, error);
      failedCount += 1;
    }
  }

  revalidatePath("/discover");

  if (matchedCount === 0 && failedCount > 0) {
    return {
      status: "error",
      message: `Couldn't score any jobs right now (${failedCount} failed — likely a temporary AI provider issue). Try again in a moment.`,
    };
  }

  return {
    status: "success",
    matchedCount,
    message:
      matchedCount === 0
        ? "No new jobs to score right now — check back later."
        : `Scored ${matchedCount} new job${matchedCount === 1 ? "" : "s"}.${failedCount > 0 ? ` (${failedCount} failed, try syncing again to retry them.)` : ""}`,
  };
}
