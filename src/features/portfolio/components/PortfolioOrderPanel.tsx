import { portfolioOrderContentSchema } from "@/features/portfolio/schema";

export function PortfolioOrderPanel({
  portfolioOrder,
  projectsById,
}: {
  portfolioOrder: unknown;
  projectsById: Record<string, { title: string; category: string }>;
}) {
  const parsed = portfolioOrderContentSchema.safeParse(portfolioOrder);
  if (!parsed.success) return null;

  return (
    <div className="mt-2 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-2.5">
      <p className="mb-1 text-xs font-bold uppercase text-muted-foreground">Portfolio order</p>
      <ol className="mb-1.5 list-decimal pl-4 text-xs">
        {parsed.data.projectIds.map((id) => (
          <li key={id}>{projectsById[id]?.title ?? "Unknown project"}</li>
        ))}
      </ol>
      <p className="text-xs text-muted-foreground">{parsed.data.reasoning}</p>
    </div>
  );
}
