import OpenAI from "openai";
import {
  matchResultSchema,
  resumeResultSchema,
  interviewPrepResultSchema,
  type AIProvider,
  type CoverLetterInput,
  type InterviewPrepInput,
  type InterviewPrepResult,
  type MatchInput,
  type MatchResult,
  type ResumeInput,
  type ResumeResult,
} from "@/lib/ai/types";
import { buildCoverLetterPrompt, buildInterviewPrepPrompt, buildMatchPrompt, buildResumePrompt } from "@/lib/ai/prompt";

// OpenRouter's free-tier model lineup changes over time (models get deprecated
// or rate-limited upstream) — if this one starts failing, check
// https://openrouter.ai/models?max_price=0 for a current alternative.
const MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

let client: OpenAI | undefined;
function getClient(): OpenAI {
  client ??= new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  });
  return client;
}

const JSON_INSTRUCTION =
  "\n\nRespond with ONLY a raw JSON object (no markdown fences) with exactly these keys: matchScore (0-100 integer), atsCompatibility (0-100 integer), interviewProbability (0-100 integer), strengths (array of up to 6 strings), weaknesses (array of up to 6 strings), missingSkills (array of up to 6 strings), salaryCompatibility (string), reasoning (string).";

async function matchJob(input: MatchInput): Promise<MatchResult> {
  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: buildMatchPrompt(input) + JSON_INSTRUCTION }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenRouter did not return a match score response.");
  }

  return matchResultSchema.parse(JSON.parse(content));
}

async function generateCoverLetter(input: CoverLetterInput): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: buildCoverLetterPrompt(input) }],
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenRouter did not return a cover letter.");
  }

  return content.trim();
}

const RESUME_JSON_INSTRUCTION =
  '\n\nRespond with ONLY a raw JSON object (no markdown fences) with exactly these keys: summary (string), skills (array of strings, max 15), experiences (array of objects with keys title, company, bullets — bullets is an array of up to 5 strings). The "experiences" array must have exactly one entry per numbered experience, in the same order.';

async function generateResume(input: ResumeInput): Promise<ResumeResult> {
  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: buildResumePrompt(input) + RESUME_JSON_INSTRUCTION }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenRouter did not return resume content.");
  }

  return resumeResultSchema.parse(JSON.parse(content));
}

const INTERVIEW_PREP_JSON_INSTRUCTION =
  '\n\nRespond with ONLY a raw JSON object (no markdown fences) with exactly these keys: companySummary (string), productOverview (string), companyCulture (string), salaryInsight (string), starStories (array of objects with keys title, situation, task, action, result — one entry per numbered experience, same order), behavioralQuestions (array of up to 6 strings), technicalQuestions (array of up to 6 strings), questionsToAsk (array of up to 6 strings). Do not include any recent news or competitors section.';

async function generateInterviewPrep(input: InterviewPrepInput): Promise<InterviewPrepResult> {
  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: buildInterviewPrepPrompt(input) + INTERVIEW_PREP_JSON_INSTRUCTION }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenRouter did not return interview prep content.");
  }

  return interviewPrepResultSchema.parse(JSON.parse(content));
}

export const openrouterProvider: AIProvider = { matchJob, generateCoverLetter, generateResume, generateInterviewPrep };
