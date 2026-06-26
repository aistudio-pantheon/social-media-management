import { NextResponse } from "next/server";
import { runScheduler } from "@/lib/scheduler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Manually trigger a scheduler pass (the instrumentation hook also runs this
// every 30s). Handy for demos: schedule a post in the past, hit this, watch
// it move to "published".
async function tick() {
  const result = await runScheduler(new Date().toISOString());
  return NextResponse.json(result);
}

export async function POST() {
  return tick();
}

// Vercel Cron invokes scheduled jobs with a GET request.
export async function GET() {
  return tick();
}
