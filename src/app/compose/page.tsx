"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Check, Calendar, Send } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { platformMeta } from "@/lib/ui";
import type { Platform, SocialAccount } from "@/lib/types";

const TONES = ["Friendly", "Professional", "Playful", "Bold", "Inspirational"];

export default function ComposePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [selected, setSelected] = useState<Platform[]>(["instagram"]);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Friendly");
  const [hashtags, setHashtags] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [demo, setDemo] = useState(false);
  const [scheduleAt, setScheduleAt] = useState("");
  const [saving, setSaving] = useState<null | string>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);

  useEffect(() => {
    fetch("/api/accounts")
      .then((r) => r.json())
      .then((d) => setAccounts(d.accounts ?? []))
      .catch(() => setAccounts([]));
  }, []);

  const togglePlatform = (p: Platform) =>
    setSelected((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  async function generate() {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const res = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic || content,
          platforms: selected,
          tone,
          includeHashtags: hashtags,
          variations: 3,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setSuggestions(data.captions ?? []);
      setDemo(Boolean(data.demo));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function submit(action: "draft" | "schedule" | "publish") {
    if (!content.trim()) {
      setError("Write something to post first.");
      return;
    }
    if (selected.length === 0) {
      setError("Pick at least one platform.");
      return;
    }
    if (action === "schedule" && !scheduleAt) {
      setError("Pick a date & time to schedule.");
      return;
    }
    setSaving(action);
    setError(null);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          platforms: selected,
          action,
          scheduledAt: action === "schedule" ? new Date(scheduleAt).toISOString() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      const verb =
        action === "draft" ? "Draft saved" : action === "schedule" ? "Scheduled" : "Published";
      setFlash(`${verb} ✓`);
      setContent("");
      setSuggestions([]);
      setScheduleAt("");
      router.refresh();
      if (action !== "draft") setTimeout(() => router.push("/calendar"), 700);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(null);
    }
  }

  const platforms = Object.keys(platformMeta) as Platform[];
  const connected = new Set(accounts.map((a) => a.platform));

  return (
    <div>
      <PageHeader title="Compose" subtitle="Write once, publish everywhere — with an AI co-writer" />

      <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-3">
        {/* Editor */}
        <div className="space-y-5 lg:col-span-2">
          <div className="card p-5">
            <label className="mb-2 block text-sm font-medium">Publish to</label>
            <div className="flex flex-wrap gap-2">
              {platforms.filter((p) => connected.has(p)).map((p) => {
                const active = selected.includes(p);
                const m = platformMeta[p];
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-ink-200 text-ink-600 hover:bg-ink-100"
                    }`}
                  >
                    <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold text-white"
                      style={{ backgroundColor: m.color }}
                    >
                      {m.short}
                    </span>
                    {m.label}
                    {active && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card p-5">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="What do you want to share?"
              className="w-full resize-none rounded-lg border border-ink-200 p-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-ink-500">{content.length} characters</span>
              <div className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  value={scheduleAt}
                  onChange={(e) => setScheduleAt(e.target.value)}
                  className="rounded-lg border border-ink-200 px-2 py-1.5 text-xs text-ink-600"
                />
                <button
                  onClick={() => submit("draft")}
                  disabled={saving !== null}
                  className="btn-ghost border border-ink-200"
                >
                  {saving === "draft" ? <Loader2 size={16} className="animate-spin" /> : null}
                  Save draft
                </button>
                <button
                  onClick={() => submit("schedule")}
                  disabled={saving !== null}
                  className="btn-ghost border border-ink-200"
                >
                  {saving === "schedule" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Calendar size={16} />
                  )}
                  Schedule
                </button>
                <button
                  onClick={() => submit("publish")}
                  disabled={saving !== null}
                  className="btn-primary"
                >
                  {saving === "publish" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Publish now
                </button>
              </div>
            </div>
            {flash && (
              <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                {flash}
              </p>
            )}
            {error && (
              <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
            )}
          </div>
        </div>

        {/* AI panel */}
        <div className="space-y-4 lg:col-span-1">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-ink-200 bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-3 text-white">
              <Sparkles size={18} />
              <span className="font-semibold">AI Caption Writer</span>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-600">
                  What&apos;s the post about?
                </label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. summer collection launch"
                  className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-ink-600">Tone</label>
                <div className="flex flex-wrap gap-1.5">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        tone === t
                          ? "bg-brand-600 text-white"
                          : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input
                  type="checkbox"
                  checked={hashtags}
                  onChange={(e) => setHashtags(e.target.checked)}
                  className="rounded border-ink-300"
                />
                Include hashtags
              </label>

              <button
                onClick={generate}
                disabled={loading || (!topic && !content)}
                className="btn-primary w-full"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {loading ? "Generating…" : "Generate captions"}
              </button>

              {demo && suggestions.length > 0 && (
                <p className="rounded-lg bg-amber-50 p-2 text-[11px] text-amber-700">
                  Demo captions — add ANTHROPIC_API_KEY for real Claude generation.
                </p>
              )}

              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setContent(s)}
                    className="block w-full rounded-lg border border-ink-200 p-3 text-left text-sm hover:border-brand-400 hover:bg-brand-50"
                  >
                    {s}
                    <span className="mt-1 block text-xs font-medium text-brand-600">
                      Use this →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
