import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, PenSquare } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ConnectAccount from "@/components/ConnectAccount";
import { getAccounts, getPosts } from "@/lib/store";
import { gatewayMode } from "@/lib/gateway";
import { PlatformBadge, StatusBadge, formatNumber } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const accounts = getAccounts();
  const posts = getPosts();
  const mode = gatewayMode();

  const published = posts.filter((p) => p.status === "published");
  const totalImpressions = published.reduce((s, p) => s + (p.impressions ?? 0), 0);
  const followers = accounts.reduce((s, a) => s + a.followers, 0);
  const scheduledCount = posts.filter((p) => p.status === "scheduled").length;

  const cards = [
    { label: "Total Followers", value: formatNumber(followers), change: 4.2 },
    { label: "Impressions (published)", value: formatNumber(totalImpressions), change: 11.8 },
    { label: "Engagement Rate", value: "5.3%", change: 0.7 },
    { label: "Scheduled Posts", value: String(scheduledCount), change: -2 },
  ];

  const upcoming = posts
    .filter((p) => p.status === "scheduled" || p.status === "needs_approval")
    .sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your social presence at a glance"
        action={
          <div className="flex items-center gap-3">
            <span
              className={`badge ${
                mode === "live" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {mode === "live" ? "● Live mode" : "● Sandbox mode"}
            </span>
            <Link href="/compose" className="btn-primary">
              <PenSquare size={16} /> Create Post
            </Link>
          </div>
        }
      />

      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((m) => {
            const up = m.change >= 0;
            return (
              <div key={m.label} className="card p-5">
                <p className="text-sm text-ink-500">{m.label}</p>
                <p className="mt-1 text-2xl font-semibold">{m.value}</p>
                <p
                  className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
                    up ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(m.change)}% vs last period
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="card p-5 lg:col-span-1">
            <h2 className="mb-4 font-semibold">Connected Accounts</h2>
            <div className="space-y-3">
              {accounts.map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PlatformBadge platform={a.platform} />
                    <div>
                      <p className="text-sm font-medium">{a.handle}</p>
                      <p className="text-xs text-ink-500">
                        {formatNumber(a.followers)} followers
                      </p>
                    </div>
                  </div>
                  <span className="badge bg-emerald-100 text-emerald-700">Active</span>
                </div>
              ))}
              {accounts.length === 0 && (
                <p className="text-sm text-ink-400">No accounts connected yet.</p>
              )}
            </div>
            <ConnectAccount />
          </div>

          <div className="card p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Upcoming &amp; Pending</h2>
              <Link href="/calendar" className="text-sm font-medium text-brand-600">
                View calendar →
              </Link>
            </div>
            <div className="divide-y divide-ink-100">
              {upcoming.map((p) => (
                <div key={p.id} className="flex items-center gap-4 py-3">
                  <div className="flex gap-1">
                    {p.platforms.map((pl) => (
                      <PlatformBadge key={pl} platform={pl} />
                    ))}
                  </div>
                  <p className="flex-1 truncate text-sm">{p.content}</p>
                  <span className="whitespace-nowrap text-xs text-ink-500">
                    {p.scheduledAt
                      ? new Date(p.scheduledAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>
                  <StatusBadge status={p.status} />
                </div>
              ))}
              {upcoming.length === 0 && (
                <p className="py-6 text-center text-sm text-ink-400">
                  Nothing scheduled. <Link href="/compose" className="text-brand-600">Create a post →</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
