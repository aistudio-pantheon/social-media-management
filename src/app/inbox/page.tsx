import PageHeader from "@/components/PageHeader";
import InboxList from "@/components/InboxList";
import { inbox } from "@/lib/mockData";

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
        <InboxList messages={sorted} />
        <p className="mt-3 text-center text-xs text-ink-400">
          AI auto-triages by sentiment &amp; urgency so the messages that matter surface first.
          Click <strong>AI reply</strong> to draft an on-brand response.
        </p>
      </div>
    </div>
  );
}
