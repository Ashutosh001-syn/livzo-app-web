"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 px-[clamp(16px,4vw,48px)] text-center"><h1 className="text-3xl font-semibold text-white">Something went wrong.</h1><p className="mt-3 text-zinc-500">We could not load this LivZo view.</p><Button className="mt-8" onClick={() => reset()}>Try again</Button></main>;
}