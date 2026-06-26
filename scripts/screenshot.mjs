import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "/tmp/claude-0/-home-user-social-media-management/2c83773a-4762-5f44-853e-30d734535d67/scratchpad/shots";
fs.mkdirSync(OUT, { recursive: true });

const pages = [
  { path: "/", name: "1-dashboard" },
  { path: "/compose", name: "2-compose" },
  { path: "/calendar", name: "3-calendar" },
  { path: "/analytics", name: "4-analytics" },
  { path: "/competitors", name: "5-competitors" },
  { path: "/inbox", name: "6-inbox" },
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

for (const p of pages) {
  await page.goto("http://localhost:3000" + p.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/${p.name}.png`, fullPage: true });
  console.log("shot:", p.name);
}

await browser.close();
console.log("done ->", OUT);
