import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, PenSquare } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { accounts, metricCards, posts } from "@/lib/mockData";
import { PlatformBadge, StatusBadge, formatNumber } from "@/lib/ui";

export default function DashboardPage() {
  const upcoming = posts
    .filter((p) => p.status === "scheduled" || p.status === "needs_approval")
    .sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your social presence at a glance"
        action={
          <Link href="/compose" className="btn-primary">
            <PenSquare size={16} /> Create Post
          </Link>
        }
      />

      <div className="space-y-6 p-8">
        {/* Metric cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((m) => {
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
          {/* Connected accounts */}
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
            </div>
            <button className="btn-ghost mt-4 w-full border border-dashed border-ink-200">
              + Connect account
            </button>
          </div>

          {/* Upcoming posts */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
