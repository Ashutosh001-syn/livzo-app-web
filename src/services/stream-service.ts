import { featuredStreams } from "@/lib/data/streams";
import type { LiveStream } from "@/types/stream";

export async function getFeaturedStreams(): Promise<LiveStream[]> {
  return featuredStreams;
}

export async function getStreamBySlug(slug: string): Promise<LiveStream | undefined> {
  return featuredStreams.find((stream) => stream.slug === slug);
}