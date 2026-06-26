import { NextResponse } from "next/server";
import { generateCompetitorSummary } from "@/lib/ai";
import { competitors } from "@/lib/mockData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const you = competitors.find((c) => c.name.startsWith("You"));
  const rivals = competitors.filter((c) => !c.name.startsWith("You"));
  const result = await generateCompetitorSummary({
    you: {
      handle: you?.handle ?? "@you",
      engagement: you?.avgEngagement ?? 0,
      postsPerWeek: you?.postsPerWeek ?? 0,
      growth: you?.followerGrowth7d ?? 0,
    },
    rivals: rivals.map((r) => ({
      name: r.name,
      engagement: r.avgEngagement,
      postsPerWeek: r.postsPerWeek,
      growth: r.followerGrowth7d,
    })),
  });
  return NextResponse.json(result);
}
