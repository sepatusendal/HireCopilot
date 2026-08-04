import OpenAI from "openai";
import {
  matchResultSchema,
  resumeResultSchema,
  interviewPrepResultSchema,
  portfolioResultSchema,
  questionnaireResultSchema,
  type AIProvider,
  type CoverLetterInput,
  type InterviewPrepInput,
  type InterviewPrepResult,
  type MatchInput,
  type MatchResult,
  type PortfolioInput,
  type PortfolioResult,
  type QuestionnaireInput,
  type QuestionnaireResult,
  type ResumeInput,
  type ResumeResult,
} from "@/lib/ai/types";
import {
  buildCoverLetterPrompt,
  buildInterviewPrepPrompt,
  buildMatchPrompt,
  buildPortfolioPrompt,
  buildQuestionnairePrompt,
  buildResumePrompt,
} from "@/lib/ai/prompt";

let client: OpenAI | undefined;
const REQUEST_TIMEOUT_MS = 12_000;

function getClient(): OpenAI {
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: REQUEST_TIMEOUT_MS });
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

const interviewPrepJsonSchema = {
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
        additionalProperties: false,
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
  additionalProperties: false,
};

async function generateInterviewPrep(input: InterviewPrepInput): Promise<InterviewPrepResult> {
  const response = await getClient().chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: buildInterviewPrepPrompt(input) }],
    response_format: {
      type: "json_schema",
      json_schema: { name: "provide_interview_prep", schema: interviewPrepJsonSchema, strict: true },
    },
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenAI did not return interview prep content.");
  }

  return interviewPrepResultSchema.parse(JSON.parse(content));
}

const portfolioJsonSchema = {
  type: "object",
  properties: {
    order: { type: "array", items: { type: "integer" } },
    reasoning: { type: "string" },
  },
  required: ["order", "reasoning"],
  additionalProperties: false,
};

async function reorderPortfolio(input: PortfolioInput): Promise<PortfolioResult> {
  const response = await getClient().chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: buildPortfolioPrompt(input) }],
    response_format: {
      type: "json_schema",
      json_schema: { name: "provide_portfolio_order", schema: portfolioJsonSchema, strict: true },
    },
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenAI did not return a portfolio order.");
  }

  return portfolioResultSchema.parse(JSON.parse(content));
}

const questionnaireJsonSchema = {
  type: "object",
  properties: {
    answers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          answer: { type: "string" },
          needsUserInput: { type: "boolean" },
        },
        required: ["answer", "needsUserInput"],
        additionalProperties: false,
      },
    },
  },
  required: ["answers"],
  additionalProperties: false,
};

async function answerQuestionnaire(input: QuestionnaireInput): Promise<QuestionnaireResult> {
  const response = await getClient().chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: buildQuestionnairePrompt(input) }],
    response_format: {
      type: "json_schema",
      json_schema: { name: "provide_questionnaire_answers", schema: questionnaireJsonSchema, strict: true },
    },
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenAI did not return questionnaire answers.");
  }

  return questionnaireResultSchema.parse(JSON.parse(content));
}

export const openaiProvider: AIProvider = {
  matchJob,
  generateCoverLetter,
  generateResume,
  generateInterviewPrep,
  reorderPortfolio,
  answerQuestionnaire,
};
