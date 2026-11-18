/* Draws the share image (app/opengraph-image.png, 1200 by 630) from the site's own fonts and colours.
   Run from the repo root after a font or colour change: node site/scripts/og-image.mjs  (uses the repo's Playwright). */
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const site = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
// Fonts go in as data URLs: a page set from a string cannot load file:// fonts.
const font = (p) => `data:font/woff2;base64,${readFileSync(path.join(site, p)).toString("base64")}`;
const count = JSON.parse(readFileSync(path.join(site, "../src/components.json"), "utf8")).filter((n) => /^[A-Z]/.test(n)).length;
const html = `<!doctype html><html><head><style>
@font-face { font-family: Flex; src: url("${font("public/fonts/ArchivoFlex-Variable.woff2")}"); font-weight: 800 820; font-stretch: 62% 125%; }
@font-face { font-family: Archivo; src: url("${font("../fonts/Archivo-Variable.woff2")}"); font-weight: 100 900; }
@font-face { font-family: Plex; src: url("${font("../fonts/IBMPlexMono-Regular.woff2")}"); }
html, body { margin: 0; }
body { width: 1200px; height: 630px; box-sizing: border-box; padding: 48px; background: #151413; color: #ece8e0; display: flex; flex-direction: column; }
.cap { font: 400 18px/1 Plex; letter-spacing: 0.04em; text-transform: uppercase; color: #a7a196; }
.wrap { flex: 1; display: flex; align-items: center; overflow: hidden; }
h1 { margin: 0; font: 800 200px/0.8 Flex; text-transform: uppercase; letter-spacing: -0.015em; white-space: nowrap; display: inline-block; padding-top: 0.06em; }
.foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 48px; }
p { margin: 0; font: 400 30px/1.3 Archivo; max-width: 760px; }
.hues { display: flex; gap: 8px; } .hues i { width: 24px; height: 24px; }
</style></head><body>
<div class="cap">The design system of Shreeraj Narwade</div>
<div class="wrap"><h1>Naksha</h1></div>
<div class="foot"><p>Tokens, ${count} React components, and docs written so people and AI agents can build from them.</p>
<div class="hues">${["#7fa4da", "#8dbf7c", "#de7a5e", "#e2c463", "#edb088", "#a7a196", "#a996cf"].map((c) => `<i style="background:${c}"></i>`).join("")}</div></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(async () => {
  await document.fonts.ready;
  const el = document.querySelector("h1"), cw = el.parentElement.clientWidth;
  const w = (x) => { el.style.fontVariationSettings = `"wdth" ${x}, "wght" 800`; return el.getBoundingClientRect().width; };
  let lo = 62, hi = 125; for (let k = 0; k < 14; k++) { const m = (lo + hi) / 2; if (w(m) > cw) hi = m; else lo = m; }
  if (w(125) < cw) el.style.fontSize = `${200 * cw / w(125)}px`; else w(lo);
});
await page.screenshot({ path: path.join(site, "app/opengraph-image.png") });
await browser.close();
console.log("wrote app/opengraph-image.png");
