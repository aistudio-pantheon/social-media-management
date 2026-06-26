// Runs once when the Next.js server boots. Starts the publishing scheduler
// loop so scheduled posts go out automatically while the app is running.

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

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
