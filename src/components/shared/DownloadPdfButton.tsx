"use client";

import { useState, useTransition } from "react";
import { Download } from "lucide-react";

export function DownloadPdfButton({
  id,
  fileUrl,
  exportAction,
}: {
  id: string;
  fileUrl: string | null;
  exportAction: (id: string) => Promise<{ success: boolean; message?: string; fileUrl?: string }>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState(fileUrl);

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 flex w-fit items-center gap-1.5 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-3 py-1.5 text-xs font-bold shadow-brutal-sm transition-transform hover:-translate-y-0.5"
      >
        <Download className="size-3.5" />
        Download PDF
      </a>
    );
  }

  return (
    <div className="mt-3">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await exportAction(id);
            if (result.success && result.fileUrl) {
              setUrl(result.fileUrl);
            } else {
              setError(result.message ?? "Something went wrong.");
            }
          })
        }
        className="flex items-center gap-1.5 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-3 py-1.5 text-xs font-bold shadow-brutal-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Download className="size-3.5" />
        {isPending ? "Exporting…" : "Export PDF"}
      </button>
      {error && <p className="mt-1.5 text-xs font-bold text-rejection">{error}</p>}
    </div>
  );
}
