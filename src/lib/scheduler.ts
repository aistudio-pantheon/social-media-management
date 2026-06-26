import "server-only";
import { getDuePosts, updatePost } from "./store";
import { publishPost } from "./gateway";

// Finds scheduled posts whose time has arrived and publishes them through
// the gateway, then records engagement. Called on an interval by the
// instrumentation hook, and also exposed via POST /api/scheduler/tick.

export async function runScheduler(nowIso: string): Promise<{ published: string[] }> {
  const due = getDuePosts(nowIso);
  const published: string[] = [];

  for (const post of due) {
    const results = await publishPost(post);
    const ok = results.some((r) => r.ok);
    if (!ok) {
      updatePost(post.id, { status: "failed" });
      continue;
    }
    // Aggregate seeded engagement across platforms.
    const agg = results.reduce(
      (acc, r) => {
        if (r.seedEngagement) {
          acc.likes += r.seedEngagement.likes;
          acc.comments += r.seedEngagement.comments;
          acc.shares += r.seedEngagement.shares;
          acc.impressions += r.seedEngagement.impressions;
        }
        return acc;
      },
      { likes: 0, comments: 0, shares: 0, impressions: 0 }
    );
    updatePost(post.id, {
      status: "published",
      publishedAt: nowIso,
      ...agg,
    });
    published.push(post.id);
  }

  return { published };
}

// Lightweight opportunistic sweep: called on normal requests so that, even on
// serverless hosts with no background timer or cron, due posts publish the
// next time anyone touches the app. Throttled to once every 20s per instance.
let lastSweep = 0;
export async function sweepDuePosts(): Promise<void> {
  const now = Date.now();
  if (now - lastSweep < 20_000) return;
  lastSweep = now;
  try {
    await runScheduler(new Date(now).toISOString());
  } catch {
    /* never let the sweep break a request */
  }
}
