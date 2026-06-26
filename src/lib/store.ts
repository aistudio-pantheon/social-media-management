import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Post, SocialAccount, Platform } from "./types";
import { accounts as seedAccounts, posts as seedPosts } from "./mockData";

// ── File-backed persistence ───────────────────────────────────────
// A tiny JSON store so the app is genuinely stateful without needing a
// database server in this environment. The access functions below are the
// seam: swap their bodies for Prisma/Postgres queries and nothing else
// changes. Data lives in .data/db.json (gitignored) and survives restarts.

interface DB {
  accounts: SocialAccount[];
  posts: Post[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DATA_DIR, "db.json");

let cache: DB | null = null;
// Set to false the first time a disk write fails (e.g. read-only serverless
// filesystem like Vercel). After that we run purely in-memory, seeded from
// the demo data — the app stays fully live and free, data just resets on a
// cold start. Add a DATABASE_URL-backed store for durable persistence.
let diskWritable = true;

function load(): DB {
  if (cache) return cache;
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    cache = JSON.parse(raw) as DB;
  } catch {
    // First run (or no readable file) — seed from the demo data.
    cache = { accounts: [...seedAccounts], posts: [...seedPosts] };
    persist();
  }
  return cache!;
}

function persist() {
  if (!cache || !diskWritable) return;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(cache, null, 2), "utf8");
  } catch {
    // Read-only filesystem — degrade gracefully to in-memory only.
    diskWritable = false;
  }
}

function id(prefix: string): string {
  // Deterministic-ish unique id without Math.random/Date in module scope.
  const n = load().posts.length + load().accounts.length + 1;
  return `${prefix}_${n}_${process.hrtime.bigint().toString(36)}`;
}

// ── Accounts ──────────────────────────────────────────────────────

export function getAccounts(): SocialAccount[] {
  return load().accounts;
}

export function connectAccount(input: {
  platform: Platform;
  handle: string;
  displayName?: string;
}): SocialAccount {
  const db = load();
  const colors: Record<string, string> = {
    instagram: "#E1306C",
    facebook: "#1877F2",
    x: "#0f172a",
    linkedin: "#0A66C2",
    tiktok: "#000000",
    youtube: "#FF0000",
  };
  const account: SocialAccount = {
    id: id("acc"),
    platform: input.platform,
    handle: input.handle,
    displayName: input.displayName || input.handle,
    followers: 0,
    avatarColor: colors[input.platform] || "#6366f1",
  };
  db.accounts.push(account);
  persist();
  return account;
}

export function disconnectAccount(accountId: string): boolean {
  const db = load();
  const before = db.accounts.length;
  db.accounts = db.accounts.filter((a) => a.id !== accountId);
  persist();
  return db.accounts.length < before;
}

// ── Posts ─────────────────────────────────────────────────────────

export function getPosts(): Post[] {
  return [...load().posts].sort((a, b) =>
    (b.scheduledAt ?? b.publishedAt ?? "").localeCompare(a.scheduledAt ?? a.publishedAt ?? "")
  );
}

export function getPost(postId: string): Post | undefined {
  return load().posts.find((p) => p.id === postId);
}

export function createPost(input: {
  content: string;
  platforms: Platform[];
  scheduledAt?: string;
  status?: Post["status"];
  author?: string;
  mediaCount?: number;
}): Post {
  const db = load();
  const post: Post = {
    id: id("post"),
    content: input.content,
    platforms: input.platforms,
    status: input.status ?? (input.scheduledAt ? "scheduled" : "draft"),
    scheduledAt: input.scheduledAt,
    author: input.author ?? "You",
    mediaCount: input.mediaCount ?? 0,
  };
  db.posts.push(post);
  persist();
  return post;
}

export function updatePost(postId: string, patch: Partial<Post>): Post | undefined {
  const db = load();
  const post = db.posts.find((p) => p.id === postId);
  if (!post) return undefined;
  Object.assign(post, patch);
  persist();
  return post;
}

export function deletePost(postId: string): boolean {
  const db = load();
  const before = db.posts.length;
  db.posts = db.posts.filter((p) => p.id !== postId);
  persist();
  return db.posts.length < before;
}

/** Used by the scheduler to find posts whose time has come. */
export function getDuePosts(nowIso: string): Post[] {
  return load().posts.filter(
    (p) => p.status === "scheduled" && p.scheduledAt != null && p.scheduledAt <= nowIso
  );
}
