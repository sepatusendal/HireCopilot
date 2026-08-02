import { PageHeader } from "@/components/shared/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function DiscoverPage() {
  return (
    <div>
      <PageHeader title="Discover" description="Jobs your AI recruiter finds and scores for you." />
      <ComingSoon feature="Job Discovery" />
    </div>
  );
}
