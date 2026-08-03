import OpenAI from "openai";
import {
  matchResultSchema,
  resumeResultSchema,
  type AIProvider,
  type CoverLetterInput,
  type MatchInput,
  type MatchResult,
  type ResumeInput,
  type ResumeResult,
} from "@/lib/ai/types";
import { buildCoverLetterPrompt, buildMatchPrompt, buildResumePrompt } from "@/lib/ai/prompt";

let client: OpenAI | undefined;
function getClient(): OpenAI {
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

const jsonSchema = {
  type: "object",
  properties: {
    matchScore: { type: "integer", minimum: 0, maximum: 100 },
    atsCompatibility: { type: "integer", minimum: 0, maximum: 100 },
    interviewProbability: { type: "integer", minimum: 0, maximum: 100 },
    strengths: { type: "array", items: { type: "string" }, maxItems: 6 },
    weaknesses: { type: "array", items: { type: "string" }, maxItems: 6 },
    missingSkills: { type: "array", items: { type: "string" }, maxItems: 6 },
    salaryCompatibility: { type: "string" },
    reasoning: { type: "string" },
  },
  required: [
    "matchScore",
    "atsCompatibility",
    "interviewProbability",
    "strengths",
    "weaknesses",
    "missingSkills",
    "salaryCompatibility",
    "reasoning",
  ],
  additionalProperties: false,
};

async function matchJob(input: MatchInput): Promise<MatchResult> {
  const response = await getClient().chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: buildMatchPrompt(input) }],
    response_format: {
      type: "json_schema",
      json_schema: { name: "provide_match_score", schema: jsonSchema, strict: true },
    },
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenAI did not return a match score response.");
  }

  return matchResultSchema.parse(JSON.parse(content));
}

async function generateCoverLetter(input: CoverLetterInput): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: buildCoverLetterPrompt(input) }],
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenAI did not return a cover letter.");
  }

  return content.trim();
}

const resumeJsonSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    skills: { type: "array", items: { type: "string" }, maxItems: 15 },
    experiences: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          company: { type: "string" },
          bullets: { type: "array", items: { type: "string" }, maxItems: 5 },
        },
        required: ["title", "company", "bullets"],
        additionalProperties: false,
      },
    },
  },
  required: ["summary", "skills", "experiences"],
  additionalProperties: false,
};

async function generateResume(input: ResumeInput): Promise<ResumeResult> {
  const response = await getClient().chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: buildResumePrompt(input) }],
    response_format: {
      type: "json_schema",
      json_schema: { name: "provide_resume_content", schema: resumeJsonSchema, strict: true },
    },
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenAI did not return resume content.");
  }

  return resumeResultSchema.parse(JSON.parse(content));
}

export const openaiProvider: AIProvider = { matchJob, generateCoverLetter, generateResume };
