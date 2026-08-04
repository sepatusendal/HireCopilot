import type { CoverLetterInput, InterviewPrepInput, JobProfileInput, MatchInput, ResumeInput } from "@/lib/ai/types";

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

export function buildResumePrompt(input: ResumeInput): string {
  const { profile } = input;
  const numberedExperiences = profile.experiences
    .map((e, i) => `${i}. ${e.title} at ${e.company}${e.description ? `: ${e.description}` : ""}`)
    .join("\n");

  return `You are an expert resume writer tailoring a candidate's resume for a specific job. Your job is ONLY to rewrite wording — you are never allowed to invent companies, titles, dates, or achievements that aren't grounded in the description below.

Hard rules:
- The "experiences" array in your response MUST have exactly one entry per numbered experience below, IN THE SAME ORDER (index 0 first, etc). Do not add, remove, or reorder entries.
- For each experience, write up to 5 sharp, ATS-friendly bullet points based ONLY on that experience's description. Never invent metrics, numbers, or outcomes that aren't implied by the description.
- "skills" must only contain skills already listed in the candidate's profile below. This is a curated, tailored list, not a copy of the full list — actively EXCLUDE any skill that has no relevance to this specific job (e.g. a hobby skill like "Pottery" on a software engineering resume), even though it's real. Only include skills a hiring manager for THIS role would want to see. Do not add new skills that aren't in the profile.
- "summary" is a 2-3 sentence professional summary tailored to this role, grounded only in the real profile data.

${formatJobAndProfile(input)}

Numbered experiences to rewrite (respond with exactly this many entries, in this order):
${numberedExperiences || "(none listed — return an empty experiences array)"}`;
}

export function buildInterviewPrepPrompt(input: InterviewPrepInput): string {
  const { profile } = input;
  const numberedExperiences = profile.experiences
    .map((e, i) => `${i}. ${e.title} at ${e.company}${e.description ? `: ${e.description}` : ""}`)
    .join("\n");

  return `You are an expert interview coach helping a candidate prepare for an interview at a specific company. You are grounded ONLY in the job description and the candidate's real profile below.

Hard rules:
- Do NOT generate "recent news" or anything claiming to be current/breaking information about the company — you have no real-time access and would be guessing. Do not include a news or competitors section at all.
- companySummary/productOverview/companyCulture should be reasonable, clearly general-knowledge-level context inferred from the company name and job description — do not state specific recent facts (funding rounds, headcount numbers, executive names) unless they appear in the job description itself.
- The "starStories" array MUST have exactly one entry per numbered experience below, IN THE SAME ORDER (index 0 first). Build each as a STAR story (Situation, Task, Action, Result) using ONLY what's implied by that experience's description — never invent metrics or outcomes not grounded there.
- behavioralQuestions and technicalQuestions should be realistic questions tailored to this specific job description.
- questionsToAsk should be smart questions this candidate could ask the interviewer, tailored to the role/company.
- salaryInsight: if the job posting has a salary range, reference it; otherwise say it's not listed and give general framing advice, don't invent a number.

${formatJobAndProfile(input)}

Numbered experiences for STAR stories (respond with exactly this many entries, in this order):
${numberedExperiences || "(none listed — return an empty starStories array)"}`;
}
