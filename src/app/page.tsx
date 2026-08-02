import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <span className="rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-ai px-4 py-1.5 text-sm font-bold text-ai-foreground shadow-brutal-sm">
        Wira AI Career Agent
      </span>
      <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
        HireCopilot
      </h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Find smarter. Apply better. Get hired faster.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href="/signup">
          <Button size="lg">Get started</Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="secondary">
            Sign in
          </Button>
        </Link>
      </div>
    </div>
  );
}
