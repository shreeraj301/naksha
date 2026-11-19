import { chromium } from "playwright";
const b = await chromium.launch({ args: ["--font-render-hinting=none"] });
const shot = async (path, vw, vh, file, fn) => { const p = await b.newPage({ viewport: { width: vw, height: vh }, reducedMotion: "reduce" }); await p.goto("http://127.0.0.1:4410" + path, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400); if (fn) await fn(p); await p.screenshot({ path: `/tmp/p5/${file}.png` }); await p.close(); };
await shot("/", 1440, 900, "home-index", async (p) => { await p.evaluate(() => document.querySelector("#index, .ix")?.scrollIntoView()); await p.waitForTimeout(300); });
await shot("/", 1440, 900, "home-asks", async (p) => { await p.evaluate(() => document.querySelector(".asks")?.scrollIntoView()); await p.waitForTimeout(300); });
await shot("/", 390, 844, "home-phone");
await shot("/brand/", 1440, 900, "brand", async (p) => { await p.evaluate(() => window.scrollTo(0, 700)); });
await b.close();
