import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const css = readFileSync("dist/css/naksha.css", "utf8").replace(/url\("\.\.\/fonts\//g, `url("file://${process.cwd()}/dist/fonts/`) + readFileSync("dist/css/components.css", "utf8");
const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const btn = (v, label, state, icon) => `<span class="nk-btn nk-btn--${v} ${icon ? "nk-btn--trail" : ""} ${state}"><span>${label}</span>${icon ? arrow : ""}</span>`;
const OPTIONS = {
  "A · Tint (today)": ``,
  "B · Invert": `
    .nk-btn--primary.is-hover { background: transparent; color: var(--fg-default); box-shadow: inset 0 0 0 1px var(--fg-default); }
    .nk-btn--highlight.is-hover { background: var(--bg-canvas); color: var(--fg-default); box-shadow: inset 0 0 0 1px var(--action-highlight); }
    .nk-btn--secondary.is-hover { background: var(--fg-default); color: var(--bg-canvas); }`,
  "C · Sweep and carry": `
    .nk-btn { position: relative; overflow: hidden; isolation: isolate; }
    .nk-btn::before { content: ""; position: absolute; inset: 0; z-index: -1; transform: scaleX(0); transform-origin: left; background: var(--sweep); }
    .nk-btn--primary { --sweep: var(--action-primary-pressed); } .nk-btn--highlight { --sweep: var(--action-highlight-pressed); } .nk-btn--secondary { --sweep: var(--state-pressed); }
    .nk-btn.is-hover::before { transform: scaleX(1); }
    .nk-btn--primary.is-hover, .nk-btn--highlight.is-hover, .nk-btn--secondary.is-hover { background: revert-layer; }
    .nk-btn.is-hover svg { transform: translateX(4px); }`,
};
const b = await chromium.launch({ args: ["--font-render-hinting=none"] });
for (const theme of ["dark", "light"]) {
  const rows = Object.entries(OPTIONS).map(([name, extra]) => `<style>${extra.replace(/\.nk-btn/g, `.opt-${name[0]} .nk-btn`)}</style>
    <div class="opt opt-${name[0]}"><b>${name}</b><div class="grid"><span class="cap">Rest</span><span class="cap">Hover</span>
      <div class="cell">${btn("highlight", "Get started", "", 1)} ${btn("primary", "Save changes", "")} ${btn("secondary", "Read with Claude", "")}</div>
      <div class="cell">${btn("highlight", "Get started", "is-hover", 1)} ${btn("primary", "Save changes", "is-hover")} ${btn("secondary", "Read with Claude", "is-hover")}</div></div></div>`).join("");
  const p = await b.newPage({ viewport: { width: 1200, height: 520 } });
  await p.setContent(`<!doctype html><html data-theme="${theme}"><head><style>${css}
    body { margin: 0; padding: 32px; background: var(--bg-canvas); color: var(--fg-default); font-family: var(--font-sans); }
    .opt { padding: 20px 0; border-top: 1px solid var(--border-default); } .opt b { display: block; font-size: 15px; margin-bottom: 12px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 48px; } .cap { font: 12px var(--font-mono); text-transform: uppercase; color: var(--fg-muted); letter-spacing: .04em; }
    .cell { display: flex; gap: 12px; align-items: center; }</style></head><body>${rows}</body></html>`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `/tmp/p5/hover-${theme}.png`, fullPage: true });
  await p.close();
}
await b.close();
