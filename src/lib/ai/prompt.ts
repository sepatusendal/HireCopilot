import type { CoverLetterInput, JobProfileInput, MatchInput } from "@/lib/ai/types";

function formatJobAndProfile(input: JobProfileInput): string {
  const { job, profile } = input;
  return `## Job
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
${profile.experiences.map((e) => `- ${e.title} at ${e.company}${e.description ? `: ${e.description}` : ""}`).join("\n") || "None listed"}`;
}

export function buildMatchPrompt(input: MatchInput): string {
  return `You are an expert technical recruiter evaluating how well a candidate fits a job. Be honest and specific — never inflate scores to be nice. Every claim must be traceable to something in the job description or the candidate profile below.

${formatJobAndProfile(input)}

Return a matchScore (0-100), atsCompatibility (0-100), interviewProbability (0-100), up to 6 strengths, up to 6 weaknesses, up to 6 missingSkills, a salaryCompatibility note, and a plain-English reasoning paragraph explaining the score.`;
}

export function buildCoverLetterPrompt(input: CoverLetterInput): string {
  return `You are an expert cover letter writer helping a candidate apply to a specific role. Write a genuinely tailored cover letter — reference the company and role by name, and connect the candidate's real experience to what the job actually needs.

Hard rules:
- Never invent experience, skills, or achievements not present in the candidate profile below.
- Do not start with a cliché like "I am writing to express my interest in..." — open with something specific to this company/role instead.
- Keep it to roughly 250-350 words, three to four short paragraphs, no placeholder brackets like "[Company Name]".
- Professional but personable tone — not stiff corporate boilerplate.

${formatJobAndProfile(input)}

Write only the cover letter body text (no subject line, no "Dear Hiring Manager" salutation is required unless it flows naturally, no sign-off boilerplate beyond a simple closing line).`;
}
