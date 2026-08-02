import { GoogleGenAI, Type } from "@google/genai";
import { matchResultSchema, type AIProvider, type MatchInput, type MatchResult } from "@/lib/ai/types";
import { buildMatchPrompt } from "@/lib/ai/prompt";

const REQUEST_TIMEOUT_MS = 20_000;

let client: GoogleGenAI | undefined;
function getClient(): GoogleGenAI {
  client ??= new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    httpOptions: { timeout: REQUEST_TIMEOUT_MS },
  });
  return client;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: { type: Type.INTEGER },
    atsCompatibility: { type: Type.INTEGER },
    interviewProbability: { type: Type.INTEGER },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    salaryCompatibility: { type: Type.STRING },
    reasoning: { type: Type.STRING },
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
};

async function matchJob(input: MatchInput): Promise<MatchResult> {
  const response = await getClient().models.generateContent({
    model: "gemini-flash-latest",
    contents: buildMatchPrompt(input),
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini did not return a match score response.");
  }

  return matchResultSchema.parse(JSON.parse(text));
}

export const geminiProvider: AIProvider = { matchJob };
