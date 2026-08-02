import { PageHeader } from "@/components/shared/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function MissionPage() {
  return (
    <div>
      <PageHeader title="Today's Mission" description="What your AI recruiter wants you to focus on today." />
      <ComingSoon feature="Daily Missions" />
    </div>
  );
}
