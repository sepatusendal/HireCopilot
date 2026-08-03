import Anthropic from "@anthropic-ai/sdk";
import {
  matchResultSchema,
  type AIProvider,
  type CoverLetterInput,
  type MatchInput,
  type MatchResult,
} from "@/lib/ai/types";
import { buildCoverLetterPrompt, buildMatchPrompt } from "@/lib/ai/prompt";

let client: Anthropic | undefined;
function getClient(): Anthropic {
  client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

const MATCH_TOOL_NAME = "provide_match_score";

const matchTool: Anthropic.Tool = {
  name: MATCH_TOOL_NAME,
  description: "Provide a structured, explainable match score between a candidate profile and a job.",
  input_schema: {
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
  },
};

async function matchJob(input: MatchInput): Promise<MatchResult> {
  const response = await getClient().messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1024,
    tools: [matchTool],
    tool_choice: { type: "tool", name: MATCH_TOOL_NAME },
    messages: [{ role: "user", content: `${buildMatchPrompt(input)}\n\nCall the ${MATCH_TOOL_NAME} tool with your evaluation.` }],
  });

  const toolUseBlock = response.content.find((block) => block.type === "tool_use");
  if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
    throw new Error("Claude did not return a match score tool call.");
  }

  return matchResultSchema.parse(toolUseBlock.input);
}

async function generateCoverLetter(input: CoverLetterInput): Promise<string> {
  const response = await getClient().messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: buildCoverLetterPrompt(input) }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude did not return a cover letter.");
  }

  return textBlock.text.trim();
}

export const claudeProvider: AIProvider = { matchJob, generateCoverLetter };
