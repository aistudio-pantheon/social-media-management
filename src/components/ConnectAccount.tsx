"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { platformMeta } from "@/lib/ui";
import type { Platform } from "@/lib/types";

const PLATFORMS: Platform[] = ["instagram", "facebook", "x", "linkedin", "tiktok", "youtube"];

export default function ConnectAccount() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [handle, setHandle] = useState("");
  const [busy, setBusy] = useState(false);

  async function connect() {
    if (!handle.trim()) return;
    setBusy(true);
    try {
      await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, handle }),
      });
      setHandle("");
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-ghost mt-4 w-full border border-dashed border-ink-200"
      >
        + Connect account
      </button>
    );
  }

  return (
    <div className="mt-4 space-y-3 rounded-lg border border-ink-200 p-3">
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value as Platform)}
        className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
      >
        {PLATFORMS.map((p) => (
          <option key={p} value={p}>
            {platformMeta[p].label}
          </option>
        ))}
      </select>
      <input
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        placeholder="@handle"
        className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
      />
      <div className="flex gap-2">
        <button onClick={connect} disabled={busy} className="btn-primary flex-1">
          {busy ? "Connecting…" : "Connect"}
        </button>
        <button onClick={() => setOpen(false)} className="btn-ghost border border-ink-200">
          Cancel
        </button>
      </div>
      <p className="text-[11px] text-ink-400">
        Sandbox mode — add platform OAuth secrets to .env to connect for real.
      </p>
    </div>
  );
}
