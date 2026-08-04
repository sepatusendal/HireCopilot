import type { ResumeContent } from "@/features/resume/schema";

const STOPWORDS = new Set(
  `a an the and or but if then else for of to in on at by with from as is are was were be been being this that these those
  it its your you we our us they their he she his her will would can could should may might must shall not no nor do does did
  have has had having about into over under again further here there when where why how all any both each few more most other
  some such only own same so than too very s t just don now etc using use used per via role team years experience strong
  ability able across including including work working requirements required responsibilities qualifications preferred plus`
    .split(/\s+/)
    .filter(Boolean)
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+.# ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function resumeText(content: ResumeContent): string {
  return [content.summary, content.skills.join(" "), content.experiences.flatMap((e) => e.bullets).join(" ")].join(" ");
}

export interface AtsAnalysis {
  score: number;
  missingKeywords: string[];
  keywordDensity: Record<string, number>;
  suggestions: string[];
}

const KEYWORD_COUNT = 20;

/**
 * Deterministic keyword-overlap analysis — no AI call. ATS keyword matching
 * is a counting problem, not a reasoning problem, and doing it in code means
 * the score is 100% explainable and can never hallucinate a "missing skill"
 * that isn't actually in the job description.
 */
export function analyzeAts(jobDescription: string, resumeContent: ResumeContent): AtsAnalysis {
  const jobTokens = tokenize(jobDescription);
  const resumeTokens = tokenize(resumeText(resumeContent));
  const resumeTokenSet = new Set(resumeTokens);

  const frequency = new Map<string, number>();
  for (const token of jobTokens) {
    frequency.set(token, (frequency.get(token) ?? 0) + 1);
  }
  const jobKeywords = [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, KEYWORD_COUNT)
    .map(([word]) => word);

  const presentKeywords = jobKeywords.filter((k) => resumeTokenSet.has(k));
  const missingKeywords = jobKeywords.filter((k) => !resumeTokenSet.has(k));

  const keywordDensity: Record<string, number> = {};
  for (const keyword of jobKeywords) {
    const count = resumeTokens.filter((t) => t === keyword).length;
    keywordDensity[keyword] = resumeTokens.length > 0 ? Math.round((count / resumeTokens.length) * 1000) / 10 : 0;
  }

  const score = jobKeywords.length > 0 ? Math.round((presentKeywords.length / jobKeywords.length) * 100) : 100;

  const suggestions = missingKeywords
    .slice(0, 5)
    .map((k) => `"${k}" appears in the job description but not in your resume — if you genuinely have this, work it into a bullet or your skills list.`);

  return { score, missingKeywords, keywordDensity, suggestions };
}
