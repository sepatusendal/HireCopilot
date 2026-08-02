import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
        <span className="rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-ai px-2 py-1 text-ai-foreground shadow-brutal-sm">
          HC
        </span>
        HireCopilot
      </Link>
      <div className="w-full max-w-sm rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card p-8 shadow-brutal-lg">
        {children}
      </div>
    </div>
  );
}
