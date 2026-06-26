import "server-only";
import type { Platform, Post } from "./types";

// ── Platform gateway ──────────────────────────────────────────────
// Every social network is reached through one interface. Today the
// SandboxGateway simulates publishing so the whole app works without real
// credentials. When you add OAuth secrets to .env, the factory returns the
// real adapter for that platform instead — the rest of the app is unchanged.

export interface PublishResult {
  platform: Platform;
  ok: boolean;
  remoteId?: string;
  url?: string;
  error?: string;
  /** Seed engagement so analytics has something to show after publish. */
  seedEngagement?: { likes: number; comments: number; shares: number; impressions: number };
}

export interface PlatformAdapter {
  readonly platform: Platform;
  readonly mode: "live" | "sandbox";
  publish(post: Post): Promise<PublishResult>;
}

// Simulated provider — deterministic-ish numbers derived from content length
// so the demo is reproducible. No network, no credentials required.
class SandboxAdapter implements PlatformAdapter {
  readonly mode = "sandbox" as const;
  constructor(public readonly platform: Platform) {}

  async publish(post: Post): Promise<PublishResult> {
    const seed = (post.content.length * 37 + this.platform.length * 911) % 9000;
    const impressions = 8000 + seed * 12;
    return {
      platform: this.platform,
      ok: true,
      remoteId: `${this.platform}_${seed}`,
      url: `https://sandbox.local/${this.platform}/${seed}`,
      seedEngagement: {
        impressions,
        likes: Math.round(impressions * 0.05),
        comments: Math.round(impressions * 0.004),
        shares: Math.round(impressions * 0.008),
      },
    };
  }
}

// Real adapters are wired but gated on credentials. Each will implement the
// platform's publish API (Meta Graph, X v2, LinkedIn UGC, …). Until secrets
// are present the factory never selects them, so the app stays runnable.
class MetaAdapter implements PlatformAdapter {
  readonly mode = "live" as const;
  constructor(public readonly platform: Platform) {}
  async publish(post: Post): Promise<PublishResult> {
    // TODO: POST to https://graph.facebook.com/<ig-user-id>/media + media_publish
    void post;
    return { platform: this.platform, ok: false, error: "Meta live publishing not yet implemented" };
  }
}

function platformConfigured(platform: Platform): boolean {
  switch (platform) {
    case "instagram":
    case "facebook":
      return Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET);
    case "x":
      return Boolean(process.env.X_CLIENT_ID && process.env.X_CLIENT_SECRET);
    case "linkedin":
      return Boolean(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);
    default:
      return false;
  }
}

export function getAdapter(platform: Platform): PlatformAdapter {
  if (platformConfigured(platform)) {
    if (platform === "instagram" || platform === "facebook") return new MetaAdapter(platform);
    // x / linkedin real adapters would be returned here once implemented.
  }
  return new SandboxAdapter(platform);
}

/** Publish a post to all its platforms and aggregate the results. */
export async function publishPost(post: Post): Promise<PublishResult[]> {
  return Promise.all(post.platforms.map((p) => getAdapter(p).publish(post)));
}

export function gatewayMode(): "live" | "sandbox" {
  const anyLive = (["instagram", "facebook", "x", "linkedin"] as Platform[]).some(platformConfigured);
  return anyLive ? "live" : "sandbox";
}
