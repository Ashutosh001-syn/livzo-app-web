import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 px-[clamp(16px,4vw,48px)] text-center"><p className="text-sm text-violet-300">404</p><h1 className="mt-3 text-[clamp(32px,3vw,48px)] font-semibold text-white">This room is offline.</h1><p className="mt-3 text-zinc-500">The page you are looking for does not exist.</p><Link href="/" className="mt-8 focus-visible:outline-2 focus-visible:outline-violet-400"><Button>Back home</Button></Link></main>;
}