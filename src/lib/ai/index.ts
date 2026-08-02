import { claudeProvider } from "@/lib/ai/providers/claude";
import { geminiProvider } from "@/lib/ai/providers/gemini";
import { openaiProvider } from "@/lib/ai/providers/openai";
import type { AIProvider } from "@/lib/ai/types";

const providers = {
  claude: claudeProvider,
  gemini: geminiProvider,
  openai: openaiProvider,
} satisfies Record<string, AIProvider>;

type ProviderName = keyof typeof providers;

function resolveProvider(): AIProvider {
  const name = (process.env.AI_PROVIDER as ProviderName | undefined) ?? "gemini";
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unknown AI_PROVIDER "${name}". Valid options: ${Object.keys(providers).join(", ")}`);
  }
  return provider;
}

export const matchJob: AIProvider["matchJob"] = (input) => resolveProvider().matchJob(input);

export type { MatchInput, MatchResult } from "@/lib/ai/types";
