"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export default function AiInsight({
  endpoint,
  title,
  initial,
}: {
  endpoint: string;
  title: string;
  initial: string;
}) {
  const [text, setText] = useState(initial);
  const [demo, setDemo] = useState(true);
  const [loading, setLoading] = useState(false);

  async function regenerate() {
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (data.insight) {
        setText(data.insight);
        setDemo(Boolean(data.demo));
      }
    } catch {
      /* keep existing text */
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card flex items-start gap-3 border-brand-200 bg-brand-50 p-5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
        <Sparkles size={16} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-brand-700">{title}</p>
          <button
            onClick={regenerate}
            disabled={loading}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline disabled:opacity-50"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {loading ? "Thinking…" : "Regenerate"}
          </button>
        </div>
        <p className="mt-0.5 text-sm text-ink-700">{text}</p>
        {demo && (
          <p className="mt-1 text-[11px] text-amber-600">
            Demo insight — add ANTHROPIC_API_KEY for live Claude analysis.
          </p>
        )}
      </div>
    </div>
  );
}
