import Link from "next/link";
import { Eye, Radio } from "lucide-react";
import type { LiveStream } from "@/types/stream";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function StreamCard({ stream }: { stream: LiveStream }) {
  return <Link href={`/live/${stream.slug}`} className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400"><Card className="group overflow-hidden transition-colors hover:border-violet-400/50"><div className="aspect-video bg-gradient-to-br from-violet-950 via-zinc-900 to-blue-950 p-3"><div className="flex items-start justify-between gap-2"><Badge className="border-red-400/30 bg-red-500/15 text-red-200"><Radio className="mr-1 size-3" />LIVE</Badge><Badge><Eye className="mr-1 size-3" />{stream.viewerCount.toLocaleString()}</Badge></div></div><div className="space-y-3 p-4"><div><h3 className="font-medium text-white group-hover:text-violet-200">{stream.title}</h3><p className="mt-1 text-sm text-zinc-500">{stream.creator.displayName} · {stream.category}</p></div><div className="flex items-center gap-2"><Avatar name={stream.creator.displayName} className="size-7" /><span className="text-xs text-zinc-400">@{stream.creator.handle}</span></div></div></Card></Link>;
}
