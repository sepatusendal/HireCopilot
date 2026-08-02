import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "jobs" | "ai" | "mission" | "interview" | "warning" | "rejection";
}

const ACCENT_BG: Record<NonNullable<StatCardProps["accent"]>, string> = {
  jobs: "bg-jobs text-jobs-foreground",
  ai: "bg-ai text-ai-foreground",
  mission: "bg-mission text-mission-foreground",
  interview: "bg-interview text-interview-foreground",
  warning: "bg-warning text-warning-foreground",
  rejection: "bg-rejection text-rejection-foreground",
};

export function StatCard({ label, value, icon: Icon, accent = "ai" }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className="text-sm font-bold text-muted-foreground">{label}</CardTitle>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border shadow-brutal-sm",
            ACCENT_BG[accent]
          )}
        >
          <Icon className="size-4" />
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-extrabold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
