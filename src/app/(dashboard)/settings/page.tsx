import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/features/profile/components/ProfileForm";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { skills: true },
  });

  return (
    <div>
      <PageHeader title="Settings" description="Your career profile — this is what the AI compares jobs against." />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Career Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            defaultValues={{
              headline: profile?.headline ?? "",
              summary: profile?.summary ?? "",
              targetRoles: profile?.targetRoles.join(", ") ?? "",
              experienceLevel: profile?.experienceLevel ?? "",
              skills: profile?.skills.map((s) => s.name).join(", ") ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
