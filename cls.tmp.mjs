import { chromium } from "playwright";
const b = await chromium.launch();
for (const path of process.argv.slice(2)) {
  const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await p.addInitScript(() => { window.__s = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__s.push({ t: Math.round(e.startTime), v: +e.value.toFixed(3), src: (e.sources || []).map((s) => (s.node ? (s.node.tagName || "#text") + "." + (s.node.className || "").toString().slice(0, 30) : "?") + ` ${Math.round(s.previousRect.y)}->${Math.round(s.currentRect.y)} h${Math.round(s.previousRect.height)}->${Math.round(s.currentRect.height)}`) }); }).observe({ type: "layout-shift", buffered: true }); });
  await p.goto("http://127.0.0.1:4410" + path, { waitUntil: "load", timeout: 120000 }); await p.waitForTimeout(3000);
  console.log(path, JSON.stringify(await p.evaluate(() => window.__s), null, 0).slice(0, 1500));
  await ctx.close();
}
await b.close();
