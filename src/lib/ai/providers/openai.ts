import OpenAI from "openai";
import { matchResultSchema, type AIProvider, type MatchInput, type MatchResult } from "@/lib/ai/types";
import { buildMatchPrompt } from "@/lib/ai/prompt";

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

export const openaiProvider: AIProvider = { matchJob };
