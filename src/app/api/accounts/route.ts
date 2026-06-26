import { NextResponse } from "next/server";
import { getAccounts, connectAccount, disconnectAccount } from "@/lib/store";
import { gatewayMode } from "@/lib/gateway";
import type { Platform } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ accounts: getAccounts(), mode: gatewayMode() });
}

// Connect an account. With real OAuth secrets this would redirect through the
// provider's consent screen; in sandbox mode we register it directly.
export async function POST(req: Request) {
  let body: { platform?: Platform; handle?: string; displayName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.platform || !body.handle?.trim()) {
    return NextResponse.json({ error: "platform and handle are required." }, { status: 400 });
  }
  const account = connectAccount({
    platform: body.platform,
    handle: body.handle,
    displayName: body.displayName,
  });
  return NextResponse.json({ account, mode: gatewayMode() });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const ok = disconnectAccount(id);
  return NextResponse.json({ disconnected: ok }, { status: ok ? 200 : 404 });
}
