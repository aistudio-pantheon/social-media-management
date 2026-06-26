import type {
  AnalyticsPoint,
  Competitor,
  InboxMessage,
  MetricCard,
  Post,
  SocialAccount,
} from "./types";

// Mock data backs the UI today. Swap each of these for a real DB /
// platform-API query as you wire up the backend — the shapes won't change.

export const accounts: SocialAccount[] = [
  { id: "a1", platform: "instagram", handle: "@pantheon.ae", displayName: "Pantheon", followers: 48200, avatarColor: "#E1306C" },
  { id: "a2", platform: "facebook", handle: "Pantheon", displayName: "Pantheon", followers: 31050, avatarColor: "#1877F2" },
  { id: "a3", platform: "x", handle: "@pantheon_ae", displayName: "Pantheon", followers: 19800, avatarColor: "#0f172a" },
  { id: "a4", platform: "linkedin", handle: "Pantheon", displayName: "Pantheon", followers: 26400, avatarColor: "#0A66C2" },
];

export const metricCards: MetricCard[] = [
  { label: "Total Followers", value: "125.4K", change: 4.2 },
  { label: "Impressions (30d)", value: "2.1M", change: 11.8 },
  { label: "Engagement Rate", value: "5.3%", change: 0.7 },
  { label: "Scheduled Posts", value: "18", change: -2 },
];

export const analyticsSeries: AnalyticsPoint[] = [
  { date: "Mon", impressions: 42000, engagement: 2100, followers: 124800 },
  { date: "Tue", impressions: 51000, engagement: 2680, followers: 124950 },
  { date: "Wed", impressions: 48500, engagement: 2400, followers: 125100 },
  { date: "Thu", impressions: 63000, engagement: 3500, followers: 125260 },
  { date: "Fri", impressions: 72000, engagement: 4200, followers: 125380 },
  { date: "Sat", impressions: 58000, engagement: 3100, followers: 125410 },
  { date: "Sun", impressions: 46000, engagement: 2300, followers: 125400 },
];

export const posts: Post[] = [
  {
    id: "p1",
    content: "New collection drops Friday 🔥 Which piece are you grabbing first?",
    platforms: ["instagram", "facebook"],
    status: "scheduled",
    scheduledAt: "2026-06-27T13:00:00Z",
    author: "Sara",
    mediaCount: 3,
  },
  {
    id: "p2",
    content: "Behind the scenes of this week's shoot ✨ #BTS",
    platforms: ["instagram", "x"],
    status: "scheduled",
    scheduledAt: "2026-06-28T09:30:00Z",
    author: "Omar",
    mediaCount: 1,
  },
  {
    id: "p3",
    content: "How we cut our content production time in half with AI — a thread 🧵",
    platforms: ["x", "linkedin"],
    status: "needs_approval",
    scheduledAt: "2026-06-29T15:00:00Z",
    author: "Lina",
    mediaCount: 0,
  },
  {
    id: "p4",
    content: "Thank you for 125K! 🎉 You make this community what it is.",
    platforms: ["instagram", "facebook", "x", "linkedin"],
    status: "published",
    publishedAt: "2026-06-24T17:00:00Z",
    author: "Sara",
    mediaCount: 1,
    likes: 8420,
    comments: 312,
    shares: 540,
    impressions: 142000,
  },
  {
    id: "p5",
    content: "Our founder on building a brand from Dubai 🌍 Full interview in bio.",
    platforms: ["linkedin"],
    status: "published",
    publishedAt: "2026-06-22T08:00:00Z",
    author: "Lina",
    mediaCount: 1,
    likes: 1240,
    comments: 88,
    shares: 130,
    impressions: 38000,
  },
  {
    id: "p6",
    content: "Draft idea: summer giveaway mechanics — tag 3 friends to enter.",
    platforms: ["instagram"],
    status: "draft",
    author: "Omar",
    mediaCount: 0,
  },
];

export const inbox: InboxMessage[] = [
  { id: "m1", platform: "instagram", type: "comment", author: "@noura_k", text: "Is the new collection available in store or online only?", receivedAt: "2026-06-26T08:12:00Z", sentiment: "neutral", priority: "high", unread: true },
  { id: "m2", platform: "x", type: "mention", author: "@designdaily", text: "Loving what @pantheon_ae is doing with their feed lately 🔥", receivedAt: "2026-06-26T07:40:00Z", sentiment: "positive", priority: "medium", unread: true },
  { id: "m3", platform: "facebook", type: "dm", author: "Ahmed R.", text: "My order hasn't shipped yet and it's been a week. Can someone help?", receivedAt: "2026-06-26T06:55:00Z", sentiment: "negative", priority: "high", unread: true },
  { id: "m4", platform: "instagram", type: "comment", author: "@style.muse", text: "Need this in every color 😍", receivedAt: "2026-06-25T19:20:00Z", sentiment: "positive", priority: "low", unread: false },
  { id: "m5", platform: "linkedin", type: "comment", author: "Maya T.", text: "Great insights on the production workflow — would love a deeper write-up.", receivedAt: "2026-06-25T16:05:00Z", sentiment: "positive", priority: "medium", unread: false },
];

export const competitors: Competitor[] = [
  { id: "c1", name: "Rival Co", handle: "@rivalco", platform: "instagram", followers: 92000, followerGrowth7d: 1.8, postsPerWeek: 9, avgEngagement: 3.1, shareOfVoice: 34 },
  { id: "c2", name: "Trendline", handle: "@trendline", platform: "instagram", followers: 61000, followerGrowth7d: 3.4, postsPerWeek: 12, avgEngagement: 4.6, shareOfVoice: 22 },
  { id: "c3", name: "Moderno", handle: "@moderno", platform: "instagram", followers: 48000, followerGrowth7d: 0.9, postsPerWeek: 5, avgEngagement: 2.4, shareOfVoice: 14 },
  { id: "c4", name: "You (Pantheon)", handle: "@pantheon.ae", platform: "instagram", followers: 48200, followerGrowth7d: 4.2, postsPerWeek: 7, avgEngagement: 5.3, shareOfVoice: 30 },
];
