"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Target,
  FileStack,
  Building2,
  FileText,
  Mail,
  MessageSquare,
  BarChart3,
  Sparkles,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/mission", label: "Mission", icon: Target },
  { href: "/applications", label: "Applications", icon: FileStack },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/cover-letter", label: "Cover Letter", icon: Mail },
  { href: "/interview", label: "Interview", icon: MessageSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/ai-insights", label: "AI Insights", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-1 border-r-[var(--border-width)] border-border bg-surface p-4 md:flex">
      <Link href="/dashboard" className="mb-6 flex items-center gap-2 px-2 text-xl font-extrabold tracking-tight">
        <span className="rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-ai px-2 py-1 text-sm text-ai-foreground shadow-brutal-sm">
          HC
        </span>
        HireCopilot
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-brutal)] border-[var(--border-width)] border-transparent px-3 py-2.5 text-sm font-bold transition-colors",
                isActive
                  ? "border-border bg-card shadow-brutal-sm"
                  : "text-muted-foreground hover:border-border hover:bg-card hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
