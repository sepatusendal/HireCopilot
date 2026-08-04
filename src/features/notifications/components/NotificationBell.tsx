"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Bell } from "lucide-react";
import type { Notification } from "@prisma/client";
import { cn } from "@/lib/utils";
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/features/notifications/actions";

export function NotificationBell({ notifications }: { notifications: Notification[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(notifications);
  const [, startTransition] = useTransition();
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        onClick={() => setIsOpen((v) => !v)}
        className="relative flex size-10 items-center justify-center rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card shadow-brutal-sm hover:-translate-y-0.5"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full border-2 border-border bg-rejection text-[9px] font-extrabold text-rejection-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card p-2 shadow-brutal">
          <div className="mb-1 flex items-center justify-between px-1">
            <p className="text-xs font-bold uppercase text-muted-foreground">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={() =>
                  startTransition(async () => {
                    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
                    await markAllNotificationsReadAction();
                  })
                }
                className="text-xs font-bold underline underline-offset-4"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
            {items.length === 0 && <p className="p-3 text-xs text-muted-foreground">No notifications yet.</p>}
            {items.map((n) => (
              <Link
                key={n.id}
                href={n.link ?? "#"}
                onClick={() =>
                  startTransition(async () => {
                    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
                    await markNotificationReadAction(n.id);
                    setIsOpen(false);
                  })
                }
                className={cn(
                  "rounded-[var(--radius-brutal)] border border-transparent p-2 text-xs hover:border-border",
                  !n.read && "bg-ai/10"
                )}
              >
                <p className="font-bold">{n.title}</p>
                <p className="text-muted-foreground">{n.message}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
