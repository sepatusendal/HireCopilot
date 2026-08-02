import { Sparkles } from "lucide-react";

export function ComingSoon({ feature }: { feature: string }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-dashed border-border p-10">
      <span className="flex size-10 items-center justify-center rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-ai text-ai-foreground shadow-brutal-sm">
        <Sparkles className="size-5" />
      </span>
      <p className="text-lg font-extrabold">{feature} is being built.</p>
      <p className="text-sm text-muted-foreground">
        Your AI recruiter is getting this ready. Check back soon.
      </p>
    </div>
  );
}
