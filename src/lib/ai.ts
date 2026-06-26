import Anthropic from "@anthropic-ai/sdk";

// Single shared Claude client. All AI features (caption generation,
// repurposing, inbox reply drafting, performance insights) route through here.

const DEFAULT_MODEL = process.env.AI_MODEL || "claude-sonnet-4-6";

let client: Anthropic | null = null;

export function getClient(): Anthropic {
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
export async function complete(opts: {
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

export interface CaptionRequest {
  topic: string;
  platforms: string[];
  tone?: string;
  includeHashtags?: boolean;
  variations?: number;
}

/**
 * Generate platform-aware caption variations for a topic.
 * Returns an array of caption strings.
 */
export async function generateCaptions(req: CaptionRequest): Promise<string[]> {
  const count = Math.min(Math.max(req.variations ?? 3, 1), 5);
  const tone = req.tone || "on-brand and engaging";
  const platforms = req.platforms.length ? req.platforms.join(", ") : "Instagram";

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

  return text
    .split(/\n?-{3,}\n?/)
    .map((s) => s.trim())
    .filter(Boolean);
}
