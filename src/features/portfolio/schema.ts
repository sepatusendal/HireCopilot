import { z } from "zod";

export const portfolioOrderContentSchema = z.object({
  projectIds: z.array(z.string()),
  reasoning: z.string(),
});

export type PortfolioOrderContent = z.infer<typeof portfolioOrderContentSchema>;
