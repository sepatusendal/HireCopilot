import type { Notification } from "@prisma/client";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";

export function TopBar({ userName, notifications }: { userName: string; notifications: Notification[] }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b-[var(--border-width)] border-border bg-background px-6">
      <p className="text-sm text-muted-foreground">
        Good to see you, <span className="font-bold text-foreground">{userName}</span>
      </p>
      <NotificationBell notifications={notifications} />
    </header>
  );
}
