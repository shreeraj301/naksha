import { chromium } from "playwright";
const b = await chromium.launch({ args: ["--font-render-hinting=none"] });
const hues = [["read","blue"],["play","green"],["build","terracotta"],["pause","ochre"],["sit","peach"],["gather","stone"],["plug","violet"]];
const SPEC = `<div class="spec"><span class="spec-cap">Specimen · Colour</span>
  <div class="spec-pair"><div style="background:var(--stone-100);color:var(--stone-950)">Paper<br><small>stone-100 · #ece8e0</small></div><div style="background:var(--stone-950);color:var(--stone-100);box-shadow:inset 0 0 0 1px var(--border-strong)">Ink<br><small>stone-950 · #151413</small></div></div>
  <div class="spec-hues">${hues.map(([s]) => `<div><i style="background:var(--section-${s})"></i><small>${s}</small></div>`).join("")}</div>
  <div class="spec-type"><span style="font-family:var(--font-display);font-weight:800;font-size:56px;line-height:.9;text-transform:uppercase">Aa</span><span style="font-family:var(--font-sans);font-size:15px">Archivo for UI, 15/1.5</span><span style="font-family:var(--font-mono);font-size:12px;letter-spacing:.04em;text-transform:uppercase">IBM Plex Mono · labels</span></div></div>`;
const BASE = `.spec { border: 1px solid var(--border-strong); background: var(--bg-raised); padding: 16px; display: grid; gap: 16px; }
.spec-cap { font: 12px var(--font-mono); letter-spacing: .04em; text-transform: uppercase; color: var(--fg-muted); }
.spec-pair { display: grid; grid-template-columns: 1fr 1fr; } .spec-pair div { padding: 16px; height: 96px; font-weight: 600; } .spec-pair small { font: 12px var(--font-mono); font-weight: 400; }
.spec-hues { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; } .spec-hues i { display: block; height: 40px; } .spec-hues small { font: 11px var(--font-mono); color: var(--fg-muted); }
.spec-type { display: grid; gap: 6px; border-top: 1px solid var(--border-default); padding-top: 12px; }`;
const OPTS = {
  "A-margin": [`.dbody .prose { grid-column: 4 / span 6; } .specslot { grid-column: 10 / span 3; position: sticky; top: 5rem; align-self: start; }`, (spec) => { const d = document.createElement("aside"); d.className = "specslot"; d.innerHTML = spec; document.querySelector(".dbody").appendChild(d); }],
  "B-plates": [`.spplate { margin: 24px 0 32px; } .spplate .spec { grid-template-columns: 1.3fr 1.7fr 1fr; align-items: start; gap: 24px; } .spplate .spec-cap { grid-column: 1 / -1; }`, (spec) => { const h = [...document.querySelectorAll(".prose h2")].find((x) => x.textContent === "Colour"); const d = document.createElement("div"); d.className = "spplate"; d.innerHTML = spec; h.after(d); }],
  "C-two-up": [`.dbody .prose { grid-column: 4 / span 9; } .prose section { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 4fr); gap: 32px; align-items: start; } .prose section > h2 { grid-column: 1 / -1; } .prose section > .sp { position: sticky; top: 5rem; }`, (spec) => { const h = [...document.querySelectorAll(".prose h2")].find((x) => x.textContent === "Colour"); const d = document.createElement("div"); d.className = "sp"; d.innerHTML = spec; h.parentElement.appendChild(d); }],
};
for (const [name, [css, fn]] of Object.entries(OPTS)) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await p.goto("http://127.0.0.1:4410/brand/", { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: BASE + css });
  await p.evaluate(fn, SPEC);
  await p.evaluate(() => { const h = [...document.querySelectorAll(".prose h2")].find((x) => x.textContent === "Colour"); window.scrollTo(0, scrollY + h.getBoundingClientRect().top - 120); });
  await p.waitForTimeout(300);
  await p.screenshot({ path: `/tmp/p5/brand-${name}.png` });
  await p.close();
}
await b.close();
