"use client";

import { useState } from "react";
import { Sparkles, Loader2, Send } from "lucide-react";
import { PlatformBadge } from "@/lib/ui";
import type { InboxMessage } from "@/lib/types";

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

function Message({ m }: { m: InboxMessage }) {
  const [draft, setDraft] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function aiReply() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: m.author, text: m.text, sentiment: m.sentiment }),
      });
      const data = await res.json();
      setDraft(data.reply ?? "");
      setDemo(Boolean(data.demo));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-start gap-4 p-5 hover:bg-ink-50">
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

        {draft !== null && (
          <div className="mt-3 rounded-lg border border-brand-200 bg-brand-50 p-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-md border border-ink-200 bg-white p-2 text-sm focus:border-brand-500 focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between">
              {demo ? (
                <span className="text-[11px] text-amber-600">
                  Demo reply — add ANTHROPIC_API_KEY for live Claude.
                </span>
              ) : (
                <span className="text-[11px] text-brand-600">Drafted by Claude</span>
              )}
              <button
                onClick={() => {
                  setSent(true);
                  setDraft(null);
                }}
                className="btn-primary px-3 py-1.5 text-xs"
              >
                <Send size={12} /> Send reply
              </button>
            </div>
          </div>
        )}
        {sent && <p className="mt-2 text-xs font-medium text-emerald-600">Reply sent ✓</p>}
      </div>

      {draft === null && !sent && (
        <button
          onClick={aiReply}
          disabled={loading}
          className="btn-ghost shrink-0 border border-ink-200 text-brand-600"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          AI reply
        </button>
      )}
    </div>
  );
}

export default function InboxList({ messages }: { messages: InboxMessage[] }) {
  return (
    <div className="card divide-y divide-ink-100">
      {messages.map((m) => (
        <Message key={m.id} m={m} />
      ))}
    </div>
  );
}
