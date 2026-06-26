// ── Core domain types ─────────────────────────────────────────────

export type Platform = "instagram" | "facebook" | "x" | "linkedin" | "tiktok" | "youtube";

export type PostStatus = "draft" | "scheduled" | "published" | "failed" | "needs_approval";

export interface SocialAccount {
  id: string;
  platform: Platform;
  handle: string;
  displayName: string;
  followers: number;
  avatarColor: string; // placeholder until real avatars
}

export interface Post {
  id: string;
  content: string;
  platforms: Platform[];
  status: PostStatus;
  scheduledAt?: string; // ISO
  publishedAt?: string; // ISO
  author: string;
  mediaCount: number;
  // engagement (populated once published)
  likes?: number;
  comments?: number;
  shares?: number;
  impressions?: number;
}

export interface InboxMessage {
  id: string;
  platform: Platform;
  type: "comment" | "dm" | "mention";
  author: string;
  text: string;
  receivedAt: string; // ISO
  sentiment: "positive" | "neutral" | "negative";
  priority: "high" | "medium" | "low";
  unread: boolean;
}

export interface Competitor {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  followers: number;
  followerGrowth7d: number; // percent
  postsPerWeek: number;
  avgEngagement: number; // percent
  shareOfVoice: number; // percent
}

export interface AnalyticsPoint {
  date: string; // e.g. "Mon"
  impressions: number;
  engagement: number;
  followers: number;
}

export interface MetricCard {
  label: string;
  value: string;
  change: number; // percent vs previous period
}
