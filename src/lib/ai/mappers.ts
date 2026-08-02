import type { Company, Experience, Job, Profile, Skill } from "@prisma/client";
import type { JobProfileInput } from "@/lib/ai/types";

export type JobWithCompany = Job & { company: Company };
export type ProfileWithRelations = Profile & { skills: Skill[]; experiences: Experience[] };

export function toJobProfileInput(job: JobWithCompany, profile: ProfileWithRelations): JobProfileInput {
  return {
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
  };
}
