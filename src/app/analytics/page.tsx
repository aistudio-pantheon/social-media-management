"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Sparkles } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { analyticsSeries, posts } from "@/lib/mockData";
import { metricCards } from "@/lib/mockData";

export default function AnalyticsPage() {
  const published = posts.filter((p) => p.status === "published");
  const topPosts = [...published].sort(
    (a, b) => (b.likes ?? 0) + (b.comments ?? 0) - ((a.likes ?? 0) + (a.comments ?? 0))
  );

  return (
    <div>
      <PageHeader
        title="Reports &amp; Analytics"
        subtitle="Performance across all connected accounts"
        action={<button className="btn-primary">Export PDF report</button>}
      />

      <div className="space-y-6 p-8">
        {/* AI insight banner */}
        <div className="card flex items-start gap-3 border-brand-200 bg-brand-50 p-5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-700">AI Insight</p>
            <p className="mt-0.5 text-sm text-ink-700">
              Your engagement rate climbed <strong>0.7pts</strong> this week, driven by Friday&apos;s
              milestone post (142K impressions). Carousels outperform single images by ~40% — consider
              shifting more of next week&apos;s plan to carousels and posting around 1&nbsp;PM.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((m) => (
            <div key={m.label} className="card p-5">
              <p className="text-sm text-ink-500">{m.label}</p>
              <p className="mt-1 text-2xl font-semibold">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <h2 className="mb-4 font-semibold">Impressions (7 days)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={analyticsSeries}>
                <defs>
                  <linearGradient id="imp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="impressions" stroke="#6366f1" fill="url(#imp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h2 className="mb-4 font-semibold">Engagement (7 days)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analyticsSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="engagement" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Top performing posts</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase text-ink-400">
                <th className="pb-2 font-medium">Post</th>
                <th className="pb-2 font-medium">Likes</th>
                <th className="pb-2 font-medium">Comments</th>
                <th className="pb-2 font-medium">Shares</th>
                <th className="pb-2 font-medium">Impressions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {topPosts.map((p) => (
                <tr key={p.id}>
                  <td className="max-w-xs truncate py-3 pr-4">{p.content}</td>
                  <td className="py-3">{p.likes?.toLocaleString()}</td>
                  <td className="py-3">{p.comments?.toLocaleString()}</td>
                  <td className="py-3">{p.shares?.toLocaleString()}</td>
                  <td className="py-3">{p.impressions?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
