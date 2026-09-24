import type { LiveStream } from "@/types/stream";
import { StreamCard } from "@/components/stream/stream-card";

export function StreamGrid({ streams }: { streams: LiveStream[] }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{streams.map((stream) => <StreamCard key={stream.id} stream={stream} />)}</div>;
}
