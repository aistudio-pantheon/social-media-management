import { Sparkles, TrendingUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { competitors } from "@/lib/mockData";
import { formatNumber } from "@/lib/ui";

export default function CompetitorsPage() {
  const ranked = [...competitors].sort((a, b) => b.shareOfVoice - a.shareOfVoice);
  const you = competitors.find((c) => c.name.startsWith("You"));

  return (
    <div>
      <PageHeader
        title="Competitor Dashboard"
        subtitle="Benchmark your performance against the brands you track"
        action={<button className="btn-primary">+ Track competitor</button>}
      />

      <div className="space-y-6 p-8">
        {/* AI competitive summary */}
        <div className="card flex items-start gap-3 border-brand-200 bg-brand-50 p-5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-700">This week vs. competitors</p>
            <p className="mt-0.5 text-sm text-ink-700">
              You have the <strong>highest engagement rate (5.3%)</strong> in your set despite posting
              less often than Trendline. Trendline is growing fastest (+3.4%) by posting 12×/week —
              their Reels are driving it. Opportunity: you win on quality, so increasing cadence to
              9–10 posts/week could close the growth gap without hurting engagement.
            </p>
          </div>
        </div>

        {/* Share of voice */}
        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Share of Voice</h2>
          <div className="space-y-3">
            {ranked.map((c) => {
              const isYou = c.name.startsWith("You");
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="w-36 truncate text-sm font-medium">
                    {c.name} <span className="text-ink-400">{c.handle}</span>
                  </span>
                  <div className="h-5 flex-1 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className={`h-full rounded-full ${isYou ? "bg-brand-600" : "bg-ink-400"}`}
                      style={{ width: `${c.shareOfVoice}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm font-semibold">{c.shareOfVoice}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison table */}
        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Benchmark</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase text-ink-400">
                <th className="pb-2 font-medium">Brand</th>
                <th className="pb-2 font-medium">Followers</th>
                <th className="pb-2 font-medium">7d Growth</th>
                <th className="pb-2 font-medium">Posts/wk</th>
                <th className="pb-2 font-medium">Avg Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {competitors.map((c) => {
                const isYou = c.name.startsWith("You");
                return (
                  <tr key={c.id} className={isYou ? "bg-brand-50" : ""}>
                    <td className="py-3 font-medium">
                      {c.name} <span className="text-ink-400">{c.handle}</span>
                    </td>
                    <td className="py-3">{formatNumber(c.followers)}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <TrendingUp size={14} /> {c.followerGrowth7d}%
                      </span>
                    </td>
                    <td className="py-3">{c.postsPerWeek}</td>
                    <td className="py-3 font-semibold">{c.avgEngagement}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {you && (
          <p className="text-center text-xs text-ink-400">
            Tracking {competitors.length - 1} competitors · updated daily
          </p>
        )}
      </div>
    </div>
  );
}
