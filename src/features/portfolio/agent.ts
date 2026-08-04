import { reorderPortfolio } from "@/lib/ai";
import { toPortfolioInput, type JobWithCompany, type ProfileWithPortfolio } from "@/lib/ai/mappers";
import type { PortfolioOrderContent } from "@/features/portfolio/schema";

function isValidPermutation(order: number[], length: number): boolean {
  if (order.length !== length) return false;
  const seen = new Set(order);
  if (seen.size !== length) return false;
  return order.every((i) => i >= 0 && i < length);
}

/**
 * Reorders profile.projects by relevance to the target job. The AI only ever
 * returns a permutation of indices — never new/rewritten project content. If
 * it returns something malformed (wrong length, duplicate/out-of-range index),
 * we fall back to the profile's existing project order rather than trust it.
 */
export async function reorderPortfolioForApplication(
  job: JobWithCompany,
  profile: ProfileWithPortfolio
): Promise<PortfolioOrderContent> {
  const fallbackOrder: PortfolioOrderContent = {
    projectIds: profile.projects.map((p) => p.id),
    reasoning: "Using your existing project order — the AI reordering didn't return a valid result.",
  };

  if (profile.projects.length === 0) {
    return { projectIds: [], reasoning: "No projects in your profile yet." };
  }

  const result = await reorderPortfolio(toPortfolioInput(job, profile));

  if (!isValidPermutation(result.order, profile.projects.length)) {
    return fallbackOrder;
  }

  return {
    projectIds: result.order.map((index) => profile.projects[index]!.id),
    reasoning: result.reasoning,
  };
}
