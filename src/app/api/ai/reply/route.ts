import { NextResponse } from "next/server";
import { draftReply } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { author?: string; text?: string; sentiment?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.text?.trim()) {
    return NextResponse.json({ error: "Message text is required." }, { status: 400 });
  }
  const result = await draftReply({
    author: body.author ?? "there",
    text: body.text,
    sentiment: body.sentiment ?? "neutral",
  });
  return NextResponse.json(result);
}
