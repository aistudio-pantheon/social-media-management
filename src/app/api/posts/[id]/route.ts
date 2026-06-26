import { NextResponse } from "next/server";
import { getPost, updatePost, deletePost } from "@/lib/store";
import type { Post } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getPost(id)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  let patch: Partial<Post>;
  try {
    patch = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const updated = updatePost(id, patch);
  return NextResponse.json({ post: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = deletePost(id);
  return NextResponse.json({ deleted: ok }, { status: ok ? 200 : 404 });
}
