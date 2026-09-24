import { redirect } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { getRequestCookieStore } from "@/server/auth/cookies";
import { AuthService } from "@/server/auth/service";
import { PageFrame } from "@/components/layout/page-frame";
import { CallsClient } from "./calls-client";

export const metadata = {
  title: "Face to Face Video Calls | LivZo",
};

export default async function CallsPage() {
  const authService = new AuthService({ cookies: await getRequestCookieStore() });
  const currentUser = await authService.getCurrentUser();

  // if (!currentUser) {
  //   redirect("/login?redirect=/calls");
  // }

  // Fetch all users except the current one (if logged in), ordered by coins descending
  const dbUsers = await prisma.user.findMany({
    where: currentUser ? {
      id: { not: currentUser.id }
    } : undefined,
    select: { id: true, displayName: true, handle: true, coins: true },
    orderBy: { coins: "desc" },
    take: 50,
  });

  const dummyCreators = [
    { id: "dummy-1", displayName: "Aria Winters", handle: "aria_w", coins: 54300, callPrice: 150 },
    { id: "dummy-2", displayName: "Zack Fox", handle: "zfox_live", coins: 21500, callPrice: 100 },
    { id: "dummy-3", displayName: "Luna Eclipse", handle: "luna_x", coins: 15400, callPrice: 80 },
    { id: "dummy-4", displayName: "James Carter", handle: "jcarter", coins: 8900, callPrice: 50 },
    { id: "dummy-5", displayName: "Mia Bella", handle: "mia_b", coins: 4200, callPrice: 40 },
  ];

  // Map db users to include a default callPrice (e.g. 20 coins/min) and merge with dummies
  const mergedUsers = [
    ...dummyCreators,
    ...dbUsers.map(u => ({ ...u, callPrice: 20 }))
  ].sort((a, b) => b.coins - a.coins);

  return (
    <PageFrame>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Video Calls</h1>
          <p className="mt-2 text-zinc-400">Connect face-to-face with popular creators and friends.</p>
        </div>

        <CallsClient users={mergedUsers} currentUserId={currentUser?.id || "guest"} />
      </div>
    </PageFrame>
  );
}
