import { NextResponse } from "next/server";
import { generateCaptions, type CaptionRequest } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: CaptionRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.topic || !body.topic.trim()) {
    return NextResponse.json(
      { error: "A 'topic' describing what to post about is required." },
      { status: 400 }
    );
  }

  try {
    const captions = await generateCaptions({
      topic: body.topic,
      platforms: body.platforms ?? [],
      tone: body.tone,
      includeHashtags: body.includeHashtags ?? true,
      variations: body.variations ?? 3,
    });
    return NextResponse.json({ captions });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    // Surface the friendly "missing API key" message to the client.
    const status = message.includes("ANTHROPIC_API_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
