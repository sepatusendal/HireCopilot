import Anthropic from "@anthropic-ai/sdk";
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

const RESUME_TOOL_NAME = "provide_resume_content";

const resumeTool: Anthropic.Tool = {
  name: RESUME_TOOL_NAME,
  description: "Provide tailored resume content grounded strictly in the candidate's real profile data.",
  input_schema: {
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
        },
      },
    },
    required: ["summary", "skills", "experiences"],
  },
};

async function generateResume(input: ResumeInput): Promise<ResumeResult> {
  const response = await getClient().messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1536,
    tools: [resumeTool],
    tool_choice: { type: "tool", name: RESUME_TOOL_NAME },
    messages: [{ role: "user", content: `${buildResumePrompt(input)}\n\nCall the ${RESUME_TOOL_NAME} tool with your result.` }],
  });

  const toolUseBlock = response.content.find((block) => block.type === "tool_use");
  if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
    throw new Error("Claude did not return resume content.");
  }

  return resumeResultSchema.parse(toolUseBlock.input);
}

const INTERVIEW_PREP_TOOL_NAME = "provide_interview_prep";

const interviewPrepTool: Anthropic.Tool = {
  name: INTERVIEW_PREP_TOOL_NAME,
  description: "Provide interview prep content grounded strictly in the job description and the candidate's real profile data. Never include recent news or claims about current events.",
  input_schema: {
    type: "object",
    properties: {
      companySummary: { type: "string" },
      productOverview: { type: "string" },
      companyCulture: { type: "string" },
      salaryInsight: { type: "string" },
      starStories: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            situation: { type: "string" },
            task: { type: "string" },
            action: { type: "string" },
            result: { type: "string" },
          },
          required: ["title", "situation", "task", "action", "result"],
        },
      },
      behavioralQuestions: { type: "array", items: { type: "string" }, maxItems: 6 },
      technicalQuestions: { type: "array", items: { type: "string" }, maxItems: 6 },
      questionsToAsk: { type: "array", items: { type: "string" }, maxItems: 6 },
    },
    required: [
      "companySummary",
      "productOverview",
      "companyCulture",
      "salaryInsight",
      "starStories",
      "behavioralQuestions",
      "technicalQuestions",
      "questionsToAsk",
    ],
  },
};

async function generateInterviewPrep(input: InterviewPrepInput): Promise<InterviewPrepResult> {
  const response = await getClient().messages.create({
    model: "claude-sonnet-5",
    max_tokens: 2048,
    tools: [interviewPrepTool],
    tool_choice: { type: "tool", name: INTERVIEW_PREP_TOOL_NAME },
    messages: [
      { role: "user", content: `${buildInterviewPrepPrompt(input)}\n\nCall the ${INTERVIEW_PREP_TOOL_NAME} tool with your result.` },
    ],
  });

  const toolUseBlock = response.content.find((block) => block.type === "tool_use");
  if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
    throw new Error("Claude did not return interview prep content.");
  }

  return interviewPrepResultSchema.parse(toolUseBlock.input);
}

export const claudeProvider: AIProvider = { matchJob, generateCoverLetter, generateResume, generateInterviewPrep };
