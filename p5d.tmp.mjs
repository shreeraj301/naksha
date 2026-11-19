import { chromium } from "playwright";
const b = await chromium.launch({ args: ["--font-render-hinting=none"] });
for (const [name, css] of [["asks-before", ""], ["asks-after", ".asks h2 { word-spacing: 0.12em; }"]]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await p.goto("http://127.0.0.1:4410/", { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready);
  if (css) await p.addStyleTag({ content: css });
  const h = p.locator(".asks h2"); await h.scrollIntoViewIfNeeded(); await h.screenshot({ path: `/tmp/p5/${name}.png` }); await p.close();
}
// home index: the announce and Feedback tiles as they are today
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await p.goto("http://127.0.0.1:4410/", { waitUntil: "networkidle" });
const row = p.locator(".ix a, .ix li, .ix [data-name]").filter({ hasText: /^announce$/i }).first();
console.log("announce rows", await row.count());
await b.close();
