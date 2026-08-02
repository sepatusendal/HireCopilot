import { PageHeader } from "@/components/shared/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function AIInsightsPage() {
  return (
    <div>
      <PageHeader title="AI Insights" description="Skill gaps, trending technologies, and salary trends." />
      <ComingSoon feature="Career Insights" />
    </div>
  );
}
