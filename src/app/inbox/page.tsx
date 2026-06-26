import { Sparkles } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { inbox } from "@/lib/mockData";
import { PlatformBadge } from "@/lib/ui";

const sentimentStyle: Record<string, string> = {
  positive: "bg-emerald-100 text-emerald-700",
  neutral: "bg-ink-100 text-ink-600",
  negative: "bg-red-100 text-red-700",
};

const priorityStyle: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-ink-100 text-ink-500",
};

export default function InboxPage() {
  // Sort: high priority + unread first.
  const sorted = [...inbox].sort((a, b) => {
    const w = { high: 0, medium: 1, low: 2 } as const;
    if (a.priority !== b.priority) return w[a.priority] - w[b.priority];
    return Number(b.unread) - Number(a.unread);
  });

  const unreadCount = inbox.filter((m) => m.unread).length;

  return (
    <div>
      <PageHeader
        title="Unified Inbox"
        subtitle={`${unreadCount} unread · comments, DMs & mentions across all platforms`}
      />

      <div className="p-8">
        <div className="card divide-y divide-ink-100">
          {sorted.map((m) => (
            <div key={m.id} className="flex items-start gap-4 p-5 hover:bg-ink-50">
              <PlatformBadge platform={m.platform} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{m.author}</span>
                  <span className="text-xs uppercase text-ink-400">{m.type}</span>
                  {m.unread && <span className="h-2 w-2 rounded-full bg-brand-600" />}
                </div>
                <p className="mt-1 text-sm text-ink-700">{m.text}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`badge ${sentimentStyle[m.sentiment]}`}>{m.sentiment}</span>
                  <span className={`badge ${priorityStyle[m.priority]}`}>{m.priority} priority</span>
                  <span className="text-xs text-ink-400">
                    {new Date(m.receivedAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <button className="btn-ghost shrink-0 border border-ink-200 text-brand-600">
                <Sparkles size={14} /> AI reply
              </button>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-ink-400">
          AI auto-triages by sentiment &amp; urgency so the messages that matter surface first.
        </p>
      </div>
    </div>
  );
}
