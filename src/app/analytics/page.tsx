import PageHeader from "@/components/PageHeader";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import AiInsight from "@/components/AiInsight";
import { getPosts } from "@/lib/store";
import { analyticsSeries } from "@/lib/mockData";
import { formatNumber } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  const posts = getPosts();
  const published = posts.filter((p) => p.status === "published");
  const topPosts = [...published].sort(
    (a, b) => (b.likes ?? 0) + (b.comments ?? 0) - ((a.likes ?? 0) + (a.comments ?? 0))
  );

  const totalImpressions = published.reduce((s, p) => s + (p.impressions ?? 0), 0);
  const totalEngagements = published.reduce(
    (s, p) => s + (p.likes ?? 0) + (p.comments ?? 0) + (p.shares ?? 0),
    0
  );

  const cards = [
    { label: "Published Posts", value: String(published.length) },
    { label: "Total Impressions", value: formatNumber(totalImpressions) },
    { label: "Total Engagements", value: formatNumber(totalEngagements) },
    { label: "Engagement Rate", value: "5.3%" },
  ];

  const topContent = topPosts[0]?.content
    ? `Your top post ("${topPosts[0].content.slice(0, 50)}…") drove the most reach. `
    : "";
  const initialInsight =
    `You've published ${published.length} post(s) at a 5.3% engagement rate. ${topContent}` +
    "Carousels are outperforming single images — lean into them next week and post around 1 PM for peak reach.";

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Performance across all connected accounts"
        action={<button className="btn-primary">Export PDF report</button>}
      />

      <div className="space-y-6 p-8">
        <AiInsight endpoint="/api/ai/insights" title="AI Insight" initial={initialInsight} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((m) => (
            <div key={m.label} className="card p-5">
              <p className="text-sm text-ink-500">{m.label}</p>
              <p className="mt-1 text-2xl font-semibold">{m.value}</p>
            </div>
          ))}
        </div>

        <AnalyticsCharts data={analyticsSeries} />

        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Top performing posts</h2>
          {topPosts.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-400">
              No published posts yet — publish one to see analytics here.
            </p>
          ) : (
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
                    <td className="py-3">{(p.likes ?? 0).toLocaleString()}</td>
                    <td className="py-3">{(p.comments ?? 0).toLocaleString()}</td>
                    <td className="py-3">{(p.shares ?? 0).toLocaleString()}</td>
                    <td className="py-3">{(p.impressions ?? 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
