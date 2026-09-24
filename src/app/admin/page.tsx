import { redirect } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { getRequestCookieStore } from "@/server/auth/cookies";
import { AuthService } from "@/server/auth/service";
import { PageFrame } from "@/components/layout/page-frame";
import { AdminDashboardClient } from "./admin-client";

export const metadata = {
  title: "Admin Dashboard | LivZo",
};

export default async function AdminPage() {
  const authService = new AuthService({ cookies: await getRequestCookieStore() });
  const user = await authService.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/"); // Not authorized
  }

  // Fetch all users and gifts
  const users = await prisma.user.findMany({
    select: { id: true, displayName: true, handle: true, email: true, phone: true, coins: true, role: true },
    orderBy: { createdAt: "desc" },
  });

  const gifts = await prisma.gift.findMany({
    orderBy: { cost: "asc" },
  });

  const authLogs = await prisma.authAuditEvent.findMany({
    include: { user: { select: { displayName: true, handle: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const giftLogs = await prisma.giftTransaction.findMany({
    include: {
      sender: { select: { displayName: true, handle: true } },
      receiver: { select: { displayName: true, handle: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <PageFrame>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-2 text-zinc-400">Manage users, coins, gifts, and view system logs.</p>
        </div>

        <AdminDashboardClient 
          initialUsers={users} 
          initialGifts={gifts} 
          authLogs={authLogs}
          giftLogs={giftLogs}
        />
      </div>
    </PageFrame>
  );
}
