import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/server/db/prisma";
import { PageFrame } from "@/components/layout/page-frame";
import { Heart, Image as ImageIcon, MapPin, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/server/auth/service";
import { cookies } from "next/headers";
import { ProfileGallery } from "./profile-gallery";

// The same dummy creators list to match if it's a dummy
const dummyCreators = [
  { id: "dummy-1", displayName: "Aria Winters", handle: "aria_w", coins: 54300, callPrice: 150 },
  { id: "dummy-2", displayName: "Zack Fox", handle: "zfox_live", coins: 21500, callPrice: 100 },
  { id: "dummy-3", displayName: "Luna Eclipse", handle: "luna_x", coins: 15400, callPrice: 80 },
  { id: "dummy-4", displayName: "James Carter", handle: "jcarter", coins: 8900, callPrice: 50 },
  { id: "dummy-5", displayName: "Mia Bella", handle: "mia_b", coins: 4200, callPrice: 40 },
];

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return {
    title: `@${handle} | LivZo`,
  };
}

export default async function UserProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  
  const cookieStore = await cookies();
  const authService = new AuthService({ cookies: cookieStore });
  const currentUser = await authService.getCurrentUser();
  const safeUser = currentUser ? { id: currentUser.id, displayName: currentUser.displayName } : { id: "guest", displayName: "Guest User" };

  let user = await prisma.user.findUnique({
    where: { handle },
    select: { id: true, displayName: true, handle: true, coins: true }
  });

  if (!user) {
    const dummy = dummyCreators.find(c => c.handle === handle);
    if (dummy) {
      user = dummy;
    } else {
      notFound();
    }
  }

  // Generate deterministic but random-looking stats based on handle length
  const followers = (user.handle.length * 1243 + 4500).toLocaleString();
  const following = (user.handle.length * 12 + 150).toLocaleString();
  const likes = (user.handle.length * 5432 + 12000).toLocaleString();

  // Generate mock photo grid
  const photos = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    url: `https://images.unsplash.com/photo-${1500000000000 + i * 10000000}?auto=format&fit=crop&q=80&w=800&h=800`, // Random nice unsplash ids might fail, let's use source.unsplash alternative or specific keywords.
  }));
  // Actually, random IDs might return 404. Let's use reliable placeholder IDs or a keyword service.
  const photoGrid = [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=800&auto=format&fit=crop",
  ].map((url, index) => ({
    id: `photo-${index}`,
    url,
    initialLikes: Math.floor(Math.random() * 900) + 100
  }));

  return (
    <PageFrame>
      <div className="mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] py-8 sm:py-12 pt-24">
        
        {/* Profile Header section */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-xl">
          {/* Cover Photo Area */}
          <div className="h-48 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 sm:h-64">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
          </div>

          <div className="relative px-6 pb-8 sm:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              {/* Avatar & Info */}
              <div className="-mt-16 sm:-mt-20 flex flex-col sm:flex-row items-center sm:items-end gap-5">
                <div className="relative flex size-32 sm:size-40 shrink-0 items-center justify-center rounded-full bg-black p-1.5 shadow-2xl">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-800 text-5xl font-bold text-white">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-2 right-2 size-6 rounded-full border-4 border-black bg-green-500 shadow-lg" />
                </div>
                
                <div className="text-center sm:text-left sm:pb-2">
                  <h1 className="text-3xl font-bold text-white sm:text-4xl">{user.displayName}</h1>
                  <p className="mt-1 text-lg font-medium text-violet-400">@{user.handle}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center sm:justify-end gap-3 sm:pb-2">
                <Button className="rounded-full bg-white/10 px-6 text-white hover:bg-white/20">
                  Follow
                </Button>
                <Button className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-white shadow-lg hover:from-violet-500 hover:to-blue-500">
                  <Video className="mr-2 size-4" /> Call
                </Button>
              </div>
            </div>

            {/* Stats & Bio */}
            <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-t border-white/10 pt-6">
              <div className="max-w-xl text-center sm:text-left">
                <p className="text-zinc-300 leading-relaxed">
                  Creating unforgettable moments every single day. Join my live rooms for exclusive behind-the-scenes content and real conversations! ✨
                </p>
                <div className="mt-4 flex items-center justify-center sm:justify-start gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-1.5"><MapPin className="size-4" /> Los Angeles, CA</span>
                </div>
              </div>

              <div className="flex gap-6 sm:gap-10">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">{followers}</span>
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">{following}</span>
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Following</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white">{likes}</span>
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery / Feed Section */}
        <div className="mt-12">
          <div className="mb-6 flex items-center gap-2 border-b border-white/10 pb-4 text-lg font-semibold text-white">
            <ImageIcon className="size-5 text-violet-400" /> Moments & Photos
          </div>
          
          <ProfileGallery photos={photoGrid} currentUser={safeUser} />
        </div>

      </div>
    </PageFrame>
  );
}
