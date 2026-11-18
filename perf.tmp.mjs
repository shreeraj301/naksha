import { chromium } from "playwright";
const paths = process.argv.slice(2);
const b = await chromium.launch();
for (const path of paths) {
  const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const bytes = { js: 0, font: 0, css: 0, html: 0, other: 0 };
  p.on("response", async (r) => { try { const h = await r.headerValue("content-length"); const t = r.request().resourceType(); const n = Number(h) || (await r.body()).length; const k = t === "script" ? "js" : t === "font" ? "font" : t === "stylesheet" ? "css" : t === "document" ? "html" : "other"; bytes[k] += n; } catch {} });
  await p.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0; window.__lcpEl = "";
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__lcp = e.startTime; window.__lcpEl = e.element ? e.element.tagName + "." + e.element.className : e.url; } }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
  });
  const t0 = Date.now();
  await p.goto("http://127.0.0.1:" + (process.env.P || 4410) + "" + path, { waitUntil: "load", timeout: 120000 });
  await p.waitForTimeout(3000);
  const r = await p.evaluate(() => ({ lcp: Math.round(window.__lcp), el: window.__lcpEl, cls: +window.__cls.toFixed(3) }));
  console.log(path.padEnd(22), `LCP ${r.lcp}ms`, `CLS ${r.cls}`, `JS ${(bytes.js / 1024).toFixed(0)}KB`, `fonts ${(bytes.font / 1024).toFixed(0)}KB`, `css ${(bytes.css/1024).toFixed(0)}KB`, `html ${(bytes.html/1024).toFixed(0)}KB`, r.el.slice(0, 40));
  await ctx.close();
}
await b.close();
