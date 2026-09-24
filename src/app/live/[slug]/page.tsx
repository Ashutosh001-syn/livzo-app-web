import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { featuredStreams } from "@/lib/data/streams";
import { ChatPanel } from "@/components/stream/chat-panel";
import { PageFrame } from "@/components/layout/page-frame";
import { VideoStage } from "@/components/stream/video-stage";

interface LivePageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: LivePageProps): Promise<Metadata> {
  const { slug } = await params;
  const stream = featuredStreams.find((item) => item.slug === slug);
  return { title: stream?.title ?? "Live room" };
}

export default async function LivePage({ params }: LivePageProps) {
  const { slug } = await params;
  const stream = featuredStreams.find((item) => item.slug === slug);
  if (!stream) notFound();
  return <PageFrame><main className="mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] py-8 sm:py-10"><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]"><div><VideoStage stream={stream} /><h1 className="mt-5 text-[clamp(24px,2.5vw,36px)] font-semibold text-white">{stream.title}</h1><p className="mt-2 text-[clamp(14px,1vw,18px)] text-zinc-400">{stream.creator.displayName} · {stream.category}</p></div><ChatPanel /></div></main></PageFrame>;
}
