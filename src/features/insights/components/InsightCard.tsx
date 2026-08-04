import { Sparkles, DollarSign, TrendingUp, Award } from "lucide-react";
import type { Insight } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ICONS: Record<string, typeof Sparkles> = {
  skill_gap: Sparkles,
  salary_trend: DollarSign,
  strength: Award,
  match_trend: TrendingUp,
};

export function InsightCard({ insight }: { insight: Insight }) {
  const Icon = ICONS[insight.type] ?? Sparkles;

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Icon className="size-4 text-ai" />
        <CardTitle>{insight.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{insight.description}</p>
      </CardContent>
    </Card>
  );
}
