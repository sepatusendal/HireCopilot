"use client";

import { useTransition } from "react";
import { Sparkles } from "lucide-react";
import { generateDailyBriefingAction } from "@/features/mission/actions";

export function GenerateBriefingButton({ label = "Generate today's mission" }: { label?: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await generateDailyBriefingAction();
        })
      }
      className="flex items-center gap-1.5 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-mission px-4 py-2 text-sm font-bold text-mission-foreground shadow-brutal-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Sparkles className="size-4" />
      {isPending ? "Working…" : label}
    </button>
  );
}
