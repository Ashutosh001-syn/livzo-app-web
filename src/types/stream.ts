export type StreamCategory = "gaming" | "music" | "talk" | "creative" | "sports";

export interface Creator {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl?: string;
  verified?: boolean;
}

export interface LiveStream {
  id: string;
  slug: string;
  title: string;
  category: StreamCategory;
  viewerCount: number;
  thumbnailUrl?: string;
  creator: Creator;
  isLive: boolean;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  author: Creator;
  body: string;
  sentAt: string;
}
