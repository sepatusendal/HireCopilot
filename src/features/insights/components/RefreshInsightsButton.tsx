"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { refreshInsightsAction } from "@/features/insights/actions";

export function RefreshInsightsButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await refreshInsightsAction();
            if (!result.success) setError(result.message ?? "Something went wrong.");
          })
        }
        className="flex items-center gap-1.5 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-ai px-4 py-2 text-sm font-bold text-ai-foreground shadow-brutal-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw className={isPending ? "size-4 animate-spin" : "size-4"} />
        {isPending ? "Analyzing…" : "Refresh insights"}
      </button>
      {error && <p className="text-xs font-bold text-rejection">{error}</p>}
    </div>
  );
}
