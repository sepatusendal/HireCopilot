import type { Company, Experience, Job, Profile, Skill } from "@prisma/client";
import { matchJob, type MatchResult } from "@/lib/ai";

type JobWithCompany = Job & { company: Company };
type ProfileWithRelations = Profile & { skills: Skill[]; experiences: Experience[] };

export async function matchJobToProfile(
  job: JobWithCompany,
  profile: ProfileWithRelations
): Promise<MatchResult> {
  return matchJob({
    job: {
      title: job.title,
      description: job.description,
      location: job.location,
      isRemote: job.isRemote,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      companyName: job.company.name,
    },
    profile: {
      headline: profile.headline,
      summary: profile.summary,
      targetRoles: profile.targetRoles,
      experienceLevel: profile.experienceLevel,
      skills: profile.skills.map((s) => s.name),
      experiences: profile.experiences.map((e) => ({
        title: e.title,
        company: e.company,
        description: e.description,
      })),
    },
  });
}
