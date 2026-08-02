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

export interface MatchInput {
  job: {
    title: string;
    description: string;
    location: string | null;
    isRemote: boolean;
    salaryMin: number | null;
    salaryMax: number | null;
    companyName: string;
  };
  profile: {
    headline: string | null;
    summary: string | null;
    targetRoles: string[];
    experienceLevel: string | null;
    skills: string[];
    experiences: { title: string; company: string; description: string | null }[];
  };
}

export interface AIProvider {
  matchJob(input: MatchInput): Promise<MatchResult>;
}
