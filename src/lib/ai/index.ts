import { claudeProvider } from "@/lib/ai/providers/claude";
import { geminiProvider } from "@/lib/ai/providers/gemini";
import { openaiProvider } from "@/lib/ai/providers/openai";
import { openrouterProvider } from "@/lib/ai/providers/openrouter";
import { deepseekProvider } from "@/lib/ai/providers/deepseek";
import type { AIProvider, CoverLetterInput, InterviewPrepInput, MatchInput, ResumeInput } from "@/lib/ai/types";

const providers = {
  claude: claudeProvider,
  gemini: geminiProvider,
  openai: openaiProvider,
  openrouter: openrouterProvider,
  deepseek: deepseekProvider,
} satisfies Record<string, AIProvider>;

type ProviderName = keyof typeof providers;

// Tried in order when AI_PROVIDER is unset or "auto". Claude/OpenAI are paid,
// so they're only used when explicitly selected via AI_PROVIDER — never as
// an automatic fallback that could rack up a bill without the user asking.
const FALLBACK_ORDER: ProviderName[] = ["gemini", "openrouter", "deepseek"];

function isRetryableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /\b(429|503|504)\b|RESOURCE_EXHAUSTED|UNAVAILABLE|DEADLINE_EXCEEDED|rate.?limit|quota/i.test(message);
}

async function withFallback<TInput, TOutput>(
  callProvider: (provider: AIProvider, input: TInput) => Promise<TOutput>,
  input: TInput
): Promise<TOutput> {
  const explicit = process.env.AI_PROVIDER;
  const chain: ProviderName[] =
    explicit && explicit !== "auto" ? [explicit as ProviderName] : FALLBACK_ORDER;

  let lastError: unknown;
  for (const name of chain) {
    const provider = providers[name];
    if (!provider) {
      lastError = new Error(`Unknown AI_PROVIDER "${name}". Valid options: ${Object.keys(providers).join(", ")}`);
      continue;
    }
    try {
      return await callProvider(provider, input);
    } catch (error) {
      lastError = error;
      if (!isRetryableError(error)) throw error;
      console.warn(`AI provider "${name}" failed (rate limit/timeout), trying next in fallback chain.`);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("All AI providers failed.");
}

export const matchJob = (input: MatchInput) => withFallback((provider, i) => provider.matchJob(i), input);
export const generateCoverLetter = (input: CoverLetterInput) =>
  withFallback((provider, i) => provider.generateCoverLetter(i), input);
export const generateResume = (input: ResumeInput) =>
  withFallback((provider, i) => provider.generateResume(i), input);
export const generateInterviewPrep = (input: InterviewPrepInput) =>
  withFallback((provider, i) => provider.generateInterviewPrep(i), input);

export type {
  CoverLetterInput,
  InterviewPrepInput,
  InterviewPrepResult,
  MatchInput,
  MatchResult,
  ResumeInput,
  ResumeResult,
} from "@/lib/ai/types";
