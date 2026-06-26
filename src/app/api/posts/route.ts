import { NextResponse } from "next/server";
import { getPosts, createPost } from "@/lib/store";
import { publishPost } from "@/lib/gateway";
import { sweepDuePosts } from "@/lib/scheduler";
import type { Platform } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  await sweepDuePosts();
  return NextResponse.json({ posts: getPosts() });
}

export async function POST(req: Request) {
  let body: {
    content?: string;
    platforms?: Platform[];
    scheduledAt?: string;
    action?: "draft" | "schedule" | "publish";
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.content?.trim()) {
    return NextResponse.json({ error: "Post content is required." }, { status: 400 });
  }
  if (!body.platforms?.length) {
    return NextResponse.json({ error: "Select at least one platform." }, { status: 400 });
  }

  const action = body.action ?? (body.scheduledAt ? "schedule" : "draft");

  // Create the post in the right initial state.
  const post = createPost({
    content: body.content,
    platforms: body.platforms,
    scheduledAt: action === "schedule" ? body.scheduledAt : undefined,
    status: action === "draft" ? "draft" : action === "schedule" ? "scheduled" : "draft",
  });

  // Publish-now goes straight through the gateway.
  if (action === "publish") {
    const results = await publishPost(post);
    const ok = results.some((r) => r.ok);
    const agg = results.reduce(
      (a, r) => {
        if (r.seedEngagement) {
          a.likes += r.seedEngagement.likes;
          a.comments += r.seedEngagement.comments;
          a.shares += r.seedEngagement.shares;
          a.impressions += r.seedEngagement.impressions;
        }
        return a;
      },
      { likes: 0, comments: 0, shares: 0, impressions: 0 }
    );
    const { updatePost } = await import("@/lib/store");
    const updated = updatePost(post.id, {
      status: ok ? "published" : "failed",
      publishedAt: ok ? new Date().toISOString() : undefined,
      ...(ok ? agg : {}),
    });
    return NextResponse.json({ post: updated, results });
  }

  return NextResponse.json({ post });
}
