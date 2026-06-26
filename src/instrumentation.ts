// Runs once when the Next.js server boots. Starts the publishing scheduler
// loop so scheduled posts go out automatically while the app is running.

export async function register() {
  // Keep the Node-only scheduler import INSIDE this `=== "nodejs"` block.
  // Next.js replaces `process.env.NEXT_RUNTIME` with a compile-time literal,
  // so for the Edge build this becomes `if (false) { … }` and webpack drops
  // the whole branch — including the `import("./lib/scheduler")` dependency,
  // which transitively pulls in `node:fs` and breaks the Edge/dev compile.
  // An early `return` guard does NOT achieve this: the dynamic import would
  // still sit at the function's top level and get bundled for Edge.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // On serverless platforms (Vercel) lambdas don't stay alive, so a timer is
    // pointless — a cron hitting /api/scheduler/tick handles it there instead
    // (see vercel.json). Only run the in-process loop on long-lived hosts.
    if (process.env.VERCEL) return;

    const { runScheduler } = await import("./lib/scheduler");

    const tick = async () => {
      try {
        const now = new Date().toISOString();
        const { published } = await runScheduler(now);
        if (published.length) {
          console.log(`[scheduler] published ${published.length} post(s):`, published.join(", "));
        }
      } catch (err) {
        console.error("[scheduler] tick failed:", err);
      }
    };

    // Check every 30 seconds.
    setInterval(tick, 30_000);
    console.log("[scheduler] started — checking for due posts every 30s");
  }
}
