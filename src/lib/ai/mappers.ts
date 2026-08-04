import type { Company, Experience, Job, Profile, ProjectItem, QuestionnaireAnswer, Skill } from "@prisma/client";
import type {
  JobProfileInput,
  PortfolioInput,
  QuestionnaireInput,
  QuestionnaireQuestion,
} from "@/lib/ai/types";

export type JobWithCompany = Job & { company: Company };
export type ProfileWithRelations = Profile & { skills: Skill[]; experiences: Experience[] };
export type ProfileWithPortfolio = Profile & { skills: Skill[]; experiences: Experience[]; projects: ProjectItem[] };
export type ProfileWithAnswers = Profile & {
  skills: Skill[];
  experiences: Experience[];
  questionnaireAnswers: QuestionnaireAnswer[];
};

export function toJobProfileInput(job: JobWithCompany, profile: ProfileWithRelations): JobProfileInput {
  return {
    job: {
      title: job.title,
      description: job.description,
      location: job.location,
      isRemote: job.isRemote,
      workMode: job.workMode,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      companyName: job.company.name,
    },
    profile: {
      headline: profile.headline,
      summary: profile.summary,
      targetRoles: profile.targetRoles,
      experienceLevel: profile.experienceLevel,
      location: profile.location,
      preferredWorkMode: profile.preferredWorkMode,
      skills: profile.skills.map((s) => s.name),
      experiences: profile.experiences.map((e) => ({
        title: e.title,
        company: e.company,
        description: e.description,
      })),
    },
  };
}

export function toPortfolioInput(job: JobWithCompany, profile: ProfileWithPortfolio): PortfolioInput {
  return {
    ...toJobProfileInput(job, profile),
    projects: profile.projects.map((p) => ({
      title: p.title,
      description: p.description,
      category: p.category,
      tags: p.tags,
    })),
  };
}

export function toQuestionnaireInput(
  job: JobWithCompany,
  profile: ProfileWithAnswers,
  questions: QuestionnaireQuestion[]
): QuestionnaireInput {
  return {
    ...toJobProfileInput(job, profile),
    questions,
    knownAnswers: profile.questionnaireAnswers.map((a) => ({ question: a.question, answer: a.answer })),
  };
}
