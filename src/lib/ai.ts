import Anthropic from "@anthropic-ai/sdk";

// Single shared Claude client. All AI features (caption generation,
// repurposing, inbox reply drafting, performance insights) route through here.
// When ANTHROPIC_API_KEY is absent, each helper falls back to a clearly
// labelled "demo" result so the UI is fully explorable without a key.

const DEFAULT_MODEL = process.env.AI_MODEL || "claude-sonnet-4-6";

let client: Anthropic | null = null;

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and add your key."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/** Low-level helper: send a system + user prompt, return plain text. */
async function complete(opts: {
  system: string;
  user: string;
  maxTokens?: number;
  model?: string;
}): Promise<string> {
  const anthropic = getClient();
  const msg = await anthropic.messages.create({
    model: opts.model || DEFAULT_MODEL,
    max_tokens: opts.maxTokens ?? 1024,
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

// ── Caption generation ────────────────────────────────────────────

export interface CaptionRequest {
  topic: string;
  platforms: string[];
  tone?: string;
  includeHashtags?: boolean;
  variations?: number;
}

export interface CaptionResult {
  captions: string[];
  demo: boolean;
}

export async function generateCaptions(req: CaptionRequest): Promise<CaptionResult> {
  const count = Math.min(Math.max(req.variations ?? 3, 1), 5);
  const tone = req.tone || "on-brand and engaging";
  const platforms = req.platforms.length ? req.platforms.join(", ") : "Instagram";

  if (!hasApiKey()) {
    return { captions: demoCaptions(req.topic, tone, count, req.includeHashtags ?? true), demo: true };
  }

  const system = [
    "You are an expert social media copywriter for a modern lifestyle brand.",
    "Write scroll-stopping captions that fit each platform's norms:",
    "- Instagram/Facebook: warm, emoji-friendly, a clear hook + soft CTA.",
    "- X: punchy, under 280 characters, no fluff.",
    "- LinkedIn: professional, insight-led, minimal emoji.",
    "Never use hashtag walls; if hashtags are requested, add 3-5 relevant ones.",
  ].join(" ");

  const user = [
    `Topic / brief: ${req.topic}`,
    `Target platform(s): ${platforms}`,
    `Tone: ${tone}`,
    `Hashtags: ${req.includeHashtags ? "yes, 3-5 relevant" : "no"}`,
    "",
    `Write ${count} distinct caption options.`,
    "Return ONLY the captions, each separated by a line containing exactly '---'.",
    "Do not number them or add any preamble.",
  ].join("\n");

  const text = await complete({ system, user, maxTokens: 1024 });
  const captions = text
    .split(/\n?-{3,}\n?/)
    .map((s) => s.trim())
    .filter(Boolean);
  return { captions, demo: false };
}

function demoCaptions(topic: string, tone: string, count: number, tags: boolean): string[] {
  const t = topic.trim() || "our latest update";
  const hash = tags ? "\n\n#brand #newdrop #musthave" : "";
  const templates = [
    `✨ ${cap(t)} is here. The wait is over — and trust us, it was worth it. Which one are you grabbing first?${hash}`,
    `We poured everything into ${t}. ${cap(tone)} energy, zero compromises. Tap to see more 👀${hash}`,
    `Real talk: ${t} might be our best yet. Drop a 🔥 if you agree.${hash}`,
    `Big news 📣 ${cap(t)} just landed. Limited run — don't sleep on it.${hash}`,
    `${cap(t)}, reimagined. Made for the ones who notice the details.${hash}`,
  ];
  return templates.slice(0, count);
}

// ── Performance insights ──────────────────────────────────────────

export interface InsightResult {
  insight: string;
  demo: boolean;
}

export async function generateInsight(summary: {
  totalPosts: number;
  published: number;
  topPost?: { content: string; impressions?: number };
  engagementRate: string;
}): Promise<InsightResult> {
  if (!hasApiKey()) {
    const top = summary.topPost?.content
      ? `Your top post ("${truncate(summary.topPost.content, 60)}") led on reach. `
      : "";
    return {
      insight:
        `You've published ${summary.published} of ${summary.totalPosts} posts at a ${summary.engagementRate} engagement rate. ` +
        `${top}Carousels are outperforming single images — shift more of next week's plan to carousels and post around 1 PM for the strongest reach.`,
      demo: true,
    };
  }

  const system =
    "You are a social media analyst. Give one concise, specific, actionable insight (2-3 sentences) in plain English. No preamble.";
  const user = `Account summary:\n- Posts: ${summary.totalPosts}\n- Published: ${summary.published}\n- Engagement rate: ${summary.engagementRate}\n- Top post: ${summary.topPost?.content ?? "n/a"} (${summary.topPost?.impressions ?? 0} impressions)\n\nWhat's working and what should they do next week?`;
  const insight = await complete({ system, user, maxTokens: 300 });
  return { insight, demo: false };
}

// ── Competitor summary ────────────────────────────────────────────

export async function generateCompetitorSummary(rows: {
  you: { handle: string; engagement: number; postsPerWeek: number; growth: number };
  rivals: { name: string; engagement: number; postsPerWeek: number; growth: number }[];
}): Promise<InsightResult> {
  if (!hasApiKey()) {
    const fastest = [...rows.rivals].sort((a, b) => b.growth - a.growth)[0];
    return {
      insight:
        `You have the highest engagement rate (${rows.you.engagement}%) in your set despite posting ${rows.you.postsPerWeek}×/week. ` +
        (fastest
          ? `${fastest.name} is growing fastest (+${fastest.growth}%) by posting ${fastest.postsPerWeek}×/week — mostly Reels. `
          : "") +
        "You win on quality; nudging cadence to 9–10 posts/week could close the growth gap without hurting engagement.",
      demo: true,
    };
  }
  const system =
    "You are a competitive social media analyst. In 2-3 sentences give one specific, actionable takeaway comparing the brand to its rivals. No preamble.";
  const user = `Us (${rows.you.handle}): engagement ${rows.you.engagement}%, ${rows.you.postsPerWeek} posts/wk, growth ${rows.you.growth}%.\nRivals:\n${rows.rivals
    .map((r) => `- ${r.name}: engagement ${r.engagement}%, ${r.postsPerWeek} posts/wk, growth ${r.growth}%`)
    .join("\n")}`;
  const insight = await complete({ system, user, maxTokens: 300 });
  return { insight, demo: false };
}

// ── Inbox reply drafting ──────────────────────────────────────────

export interface ReplyResult {
  reply: string;
  demo: boolean;
}

export async function draftReply(message: {
  author: string;
  text: string;
  sentiment: string;
}): Promise<ReplyResult> {
  if (!hasApiKey()) {
    const base =
      message.sentiment === "negative"
        ? `Hi ${firstName(message.author)}, so sorry for the trouble! We've flagged this to our team and will get it sorted right away. Could you DM us your order number so we can dig in?`
        : message.sentiment === "positive"
          ? `Thank you so much, ${firstName(message.author)}! 💛 This means the world to us — more good stuff coming soon.`
          : `Hi ${firstName(message.author)}, great question! Happy to help — could you share a little more so we point you in the right direction?`;
    return { reply: base, demo: true };
  }

  const system =
    "You write brand replies for a friendly lifestyle company. Reply in 1-2 sentences, on-brand, warm, and helpful. Return only the reply text.";
  const user = `A ${message.sentiment} message from ${message.author}: "${message.text}"\n\nDraft a reply.`;
  const reply = await complete({ system, user, maxTokens: 200 });
  return { reply, demo: false };
}

// ── helpers ───────────────────────────────────────────────────────
function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}
function firstName(s: string) {
  return s.replace(/^@/, "").split(/[\s.]/)[0];
}
