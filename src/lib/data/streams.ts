import type { LiveStream } from "@/types/stream";

export const featuredStreams: LiveStream[] = [
  {
    id: "stream-001",
    slug: "midnight-studio",
    title: "Midnight Studio Session",
    category: "music",
    viewerCount: 12840,
    creator: { id: "creator-001", handle: "luna", displayName: "Luna Vale", verified: true },
    isLive: true,
    tags: ["live music", "lo-fi"],
  },
  {
    id: "stream-002",
    slug: "build-in-public",
    title: "Building the next big thing",
    category: "creative",
    viewerCount: 6420,
    creator: { id: "creator-002", handle: "marc", displayName: "Marc Chen", verified: true },
    isLive: true,
    tags: ["design", "building"],
  },
  {
    id: "stream-003",
    slug: "late-night-ranked",
    title: "Late night ranked climb",
    category: "gaming",
    viewerCount: 3140,
    creator: { id: "creator-003", handle: "nova", displayName: "Nova North" },
    isLive: true,
    tags: ["competitive", "community"],
  },
];
