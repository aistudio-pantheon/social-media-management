import { NextResponse } from "next/server";
import { generateInsight } from "@/lib/ai";
import { getPosts } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const posts = getPosts();
  const published = posts.filter((p) => p.status === "published");
  const top = [...published].sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))[0];

  const result = await generateInsight({
    totalPosts: posts.length,
    published: published.length,
    topPost: top ? { content: top.content, impressions: top.impressions } : undefined,
    engagementRate: "5.3%",
  });
  return NextResponse.json(result);
}
