import PageHeader from "@/components/PageHeader";
import { posts } from "@/lib/mockData";
import { PlatformBadge, StatusBadge } from "@/lib/ui";

const HOURS_LABEL = "Best time to post: 1:00 PM & 7:00 PM (from your engagement history)";

// Build a simple 7-day strip starting "today" (fixed ref date for the demo).
const REF = new Date("2026-06-26T00:00:00Z");
const days = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(REF);
  d.setUTCDate(REF.getUTCDate() + i);
  return d;
});

export default function CalendarPage() {
  const byDay = (d: Date) =>
    posts.filter((p) => {
      if (!p.scheduledAt) return false;
      const s = new Date(p.scheduledAt);
      return (
        s.getUTCFullYear() === d.getUTCFullYear() &&
        s.getUTCMonth() === d.getUTCMonth() &&
        s.getUTCDate() === d.getUTCDate()
      );
    });

  return (
    <div>
      <PageHeader
        title="Content Calendar"
        subtitle={HOURS_LABEL}
        action={<button className="btn-primary">Bulk schedule (CSV)</button>}
      />

      <div className="p-8">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
          {days.map((d) => {
            const dayPosts = byDay(d);
            const isToday = d.getTime() === REF.getTime();
            return (
              <div
                key={d.toISOString()}
                className={`card min-h-[220px] p-3 ${isToday ? "ring-2 ring-brand-500" : ""}`}
              >
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="text-xs font-medium uppercase text-ink-400">
                    {d.toLocaleDateString(undefined, { weekday: "short" })}
                  </span>
                  <span className={`text-sm font-semibold ${isToday ? "text-brand-600" : ""}`}>
                    {d.getUTCDate()}
                  </span>
                </div>
                <div className="space-y-2">
                  {dayPosts.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-lg border border-ink-200 bg-ink-50 p-2 text-xs"
                    >
                      <div className="mb-1 flex items-center gap-1">
                        {p.platforms.map((pl) => (
                          <PlatformBadge key={pl} platform={pl} />
                        ))}
                      </div>
                      <p className="line-clamp-2 text-ink-700">{p.content}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[10px] text-ink-500">
                          {p.scheduledAt &&
                            new Date(p.scheduledAt).toLocaleTimeString(undefined, {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                        </span>
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                  ))}
                  {dayPosts.length === 0 && (
                    <button className="w-full rounded-lg border border-dashed border-ink-200 py-2 text-xs text-ink-400 hover:bg-ink-50">
                      + Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
