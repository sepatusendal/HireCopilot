import { PageHeader } from "@/components/shared/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Profile, connections, and preferences." />
      <ComingSoon feature="Settings" />
    </div>
  );
}
