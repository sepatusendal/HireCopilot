import { Bell } from "lucide-react";

export function TopBar({ userName }: { userName: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b-[var(--border-width)] border-border bg-background px-6">
      <p className="text-sm text-muted-foreground">
        Good to see you, <span className="font-bold text-foreground">{userName}</span>
      </p>
      <button
        aria-label="Notifications"
        className="flex size-10 items-center justify-center rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card shadow-brutal-sm hover:-translate-y-0.5"
      >
        <Bell className="size-4" />
      </button>
    </header>
  );
}
