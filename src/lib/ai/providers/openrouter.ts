import OpenAI from "openai";
import {
  matchResultSchema,
  type AIProvider,
  type CoverLetterInput,
  type MatchInput,
  type MatchResult,
} from "@/lib/ai/types";
import { buildCoverLetterPrompt, buildMatchPrompt } from "@/lib/ai/prompt";

const MODEL = "meta-llama/llama-3.3-70b-instruct:free";

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

export const openrouterProvider: AIProvider = { matchJob, generateCoverLetter };
