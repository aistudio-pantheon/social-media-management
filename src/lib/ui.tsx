import type { Platform, PostStatus } from "./types";

// Small shared UI helpers used across pages.

export const platformMeta: Record<Platform, { label: string; color: string; short: string }> = {
  instagram: { label: "Instagram", color: "#E1306C", short: "IG" },
  facebook: { label: "Facebook", color: "#1877F2", short: "FB" },
  x: { label: "X", color: "#0f172a", short: "X" },
  linkedin: { label: "LinkedIn", color: "#0A66C2", short: "in" },
  tiktok: { label: "TikTok", color: "#000000", short: "TT" },
  youtube: { label: "YouTube", color: "#FF0000", short: "YT" },
};

export function PlatformBadge({ platform }: { platform: Platform }) {
  const m = platformMeta[platform];
  return (
    <span
      className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold text-white"
      style={{ backgroundColor: m.color }}
      title={m.label}
    >
      {m.short}
    </span>
  );
}

const statusStyles: Record<PostStatus, string> = {
  draft: "bg-ink-100 text-ink-600",
  scheduled: "bg-brand-100 text-brand-700",
  published: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  needs_approval: "bg-amber-100 text-amber-700",
};

const statusLabel: Record<PostStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
  failed: "Failed",
  needs_approval: "Needs approval",
};

export function StatusBadge({ status }: { status: PostStatus }) {
  return <span className={`badge ${statusStyles[status]}`}>{statusLabel[status]}</span>;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}
