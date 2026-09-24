"use client";

import { useEffect, useState } from "react";
import type { LiveStream } from "@/types/stream";

export function useLiveRoom(stream: LiveStream) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connection = window.setTimeout(() => setIsConnected(true), 250);
    return () => window.clearTimeout(connection);
  }, [stream.id]);

  return { isConnected, viewerCount: stream.viewerCount };
}
