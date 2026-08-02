import type { MatchInput } from "@/lib/ai/types";

export function buildMatchPrompt(input: MatchInput): string {
  const { job, profile } = input;
  return `You are an expert technical recruiter evaluating how well a candidate fits a job. Be honest and specific — never inflate scores to be nice. Every claim must be traceable to something in the job description or the candidate profile below.

## Job
Title: ${job.title}
Company: ${job.companyName}
Location: ${job.location ?? "Not specified"}${job.isRemote ? " (Remote)" : ""}
Salary range: ${job.salaryMin ?? "?"} - ${job.salaryMax ?? "?"}
Description:
${job.description}

## Candidate profile
Headline: ${profile.headline ?? "Not set"}
Summary: ${profile.summary ?? "Not set"}
Target roles: ${profile.targetRoles.join(", ") || "Not set"}
Experience level: ${profile.experienceLevel ?? "Not set"}
Skills: ${profile.skills.join(", ") || "None listed"}
Experience:
${profile.experiences.map((e) => `- ${e.title} at ${e.company}${e.description ? `: ${e.description}` : ""}`).join("\n") || "None listed"}

Return a matchScore (0-100), atsCompatibility (0-100), interviewProbability (0-100), up to 6 strengths, up to 6 weaknesses, up to 6 missingSkills, a salaryCompatibility note, and a plain-English reasoning paragraph explaining the score.`;
}
