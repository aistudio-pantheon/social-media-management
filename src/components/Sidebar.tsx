"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenSquare,
  CalendarDays,
  BarChart3,
  Inbox,
  Swords,
  Sparkles,
} from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/compose", label: "Compose", icon: PenSquare },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/competitors", label: "Competitors", icon: Swords },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-ink-200 bg-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Sparkles size={18} />
        </div>
        <span className="text-lg font-semibold tracking-tight">Socialyze</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-100"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 p-4 text-white">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles size={16} /> AI Assistant
        </div>
        <p className="mt-1 text-xs text-brand-100">
          Generate captions, repurpose content, and get insights — powered by Claude.
        </p>
        <Link
          href="/compose"
          className="mt-3 inline-block rounded-md bg-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/25"
        >
          Try it →
        </Link>
      </div>
    </aside>
  );
}
