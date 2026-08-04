import { z } from "zod";

export const matchResultSchema = z.object({
  matchScore: z.number().int().min(0).max(100),
  atsCompatibility: z.number().int().min(0).max(100),
  interviewProbability: z.number().int().min(0).max(100),
  strengths: z.array(z.string()).max(6),
  weaknesses: z.array(z.string()).max(6),
  missingSkills: z.array(z.string()).max(6),
  salaryCompatibility: z.string(),
  reasoning: z.string(),
});

export type MatchResult = z.infer<typeof matchResultSchema>;

export interface JobProfileInput {
  job: {
    title: string;
    description: string;
    location: string | null;
    isRemote: boolean;
    workMode: string;
    salaryMin: number | null;
    salaryMax: number | null;
    companyName: string;
  };
  profile: {
    headline: string | null;
    summary: string | null;
    targetRoles: string[];
    experienceLevel: string | null;
    location: string | null;
    preferredWorkMode: string;
    skills: string[];
    experiences: { title: string; company: string; description: string | null }[];
  };
}

export type MatchInput = JobProfileInput;
export type CoverLetterInput = JobProfileInput;
export type ResumeInput = JobProfileInput;

export const resumeResultSchema = z.object({
  summary: z.string(),
  skills: z.array(z.string()).max(15),
  experiences: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      bullets: z.array(z.string()).max(5),
    })
  ),
});

export type ResumeResult = z.infer<typeof resumeResultSchema>;

export interface PortfolioInput extends JobProfileInput {
  projects: { title: string; description: string | null; category: string; tags: string[] }[];
}

export const portfolioResultSchema = z.object({
  order: z.array(z.number().int()),
  reasoning: z.string(),
});

export type PortfolioResult = z.infer<typeof portfolioResultSchema>;

export interface QuestionnaireQuestion {
  question: string;
  category: string;
}

export interface QuestionnaireInput extends JobProfileInput {
  questions: QuestionnaireQuestion[];
  knownAnswers: { question: string; answer: string }[];
}

export const questionnaireResultSchema = z.object({
  answers: z.array(
    z.object({
      answer: z.string(),
      needsUserInput: z.boolean(),
    })
  ),
});

export type QuestionnaireResult = z.infer<typeof questionnaireResultSchema>;

export type InterviewPrepInput = JobProfileInput;

export const interviewPrepResultSchema = z.object({
  companySummary: z.string(),
  productOverview: z.string(),
  companyCulture: z.string(),
  salaryInsight: z.string(),
  starStories: z.array(
    z.object({
      title: z.string(),
      situation: z.string(),
      task: z.string(),
      action: z.string(),
      result: z.string(),
    })
  ),
  behavioralQuestions: z.array(z.string()).max(6),
  technicalQuestions: z.array(z.string()).max(6),
  questionsToAsk: z.array(z.string()).max(6),
});

export type InterviewPrepResult = z.infer<typeof interviewPrepResultSchema>;

export interface AIProvider {
  matchJob(input: MatchInput): Promise<MatchResult>;
  generateCoverLetter(input: CoverLetterInput): Promise<string>;
  generateResume(input: ResumeInput): Promise<ResumeResult>;
  generateInterviewPrep(input: InterviewPrepInput): Promise<InterviewPrepResult>;
  reorderPortfolio(input: PortfolioInput): Promise<PortfolioResult>;
  answerQuestionnaire(input: QuestionnaireInput): Promise<QuestionnaireResult>;
}
