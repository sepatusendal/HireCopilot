import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/shared/Sidebar";
import { TopBar } from "@/components/shared/TopBar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar userName={session.user.name} notifications={notifications} />
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
