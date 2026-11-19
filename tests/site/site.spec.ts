// The website gates. Every page, in light and dark, with reduced motion on:
//   1. a screenshot, so any visual change is seen;
//   2. no text clipped by an ancestor that hides overflow;
//   3. no errors in the console;
//   4. axe at every severity (WCAG 2.0 to 2.2 A and AA, plus best practice).
// And every page at 320px wide: no sideways scroll (WCAG 1.4.10 Reflow). Every page has its own title, a 120 to 160
// character description, a canonical link, a share image and an icon.
//
// Issues that exist today are listed by name in known-issues.json, each with the fix-list row that removes it.
// Anything not on that list fails the build, and so does a listed issue that is gone, so the list only shrinks.
// To see everything a run finds without failing: SITE_COLLECT=/tmp/found.jsonl npm run test:site
import { test, expect, type Page } from "@playwright/test";
import { readFileSync, appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { pages, slug } from "./pages";

type Issue = { check: string; theme: string; page: string; id: string; fix: string };
const AXE = readFileSync(resolve("node_modules/axe-core/axe.min.js"), "utf8");
const KNOWN: Issue[] = JSON.parse(readFileSync(resolve("tests/site/known-issues.json"), "utf8")).issues;
const COLLECT = process.env.SITE_COLLECT;
const THEMES = ["dark", "light"] as const;

function gate(check: string, theme: string, page: string, found: string[]) {
  found = [...new Set(found)].sort();
  if (COLLECT) {
    for (const id of found) appendFileSync(COLLECT, JSON.stringify({ check, theme, page, id }) + "\n");
    return;
  }
  const known = KNOWN.filter((k) => k.check === check && k.theme === theme && k.page === page).map((k) => k.id);
  expect(found.filter((id) => !known.includes(id)), `new ${check} issues on ${page} (${theme})`).toEqual([]);
  expect(known.filter((id) => !found.includes(id)), `fixed on ${page} (${theme}): remove from tests/site/known-issues.json`).toEqual([]);
}

async function open(page: Page, path: string, theme: string) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    // The 404 page is served with status 404, and Chromium logs that for the page itself. Only other failures count.
    if (m.type() !== "error") return;
    if (m.text().startsWith("Failed to load resource") && new URL(m.location().url).pathname === path) return;
    errors.push(m.text());
  });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme as "light" | "dark" });
  await page.addInitScript((t) => { try { localStorage.setItem("naksha-theme", t); } catch {} }, theme);
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Page titles stay hidden until they are fitted to the measure. React has hydrated (TopBar marks it) and every
  // live preview has mounted, so a slow machine is not caught halfway.
  await page.waitForFunction(() =>
    [...document.querySelectorAll("h1")].every((h) => getComputedStyle(h).visibility === "visible") &&
    "ready" in document.documentElement.dataset &&
    [...document.querySelectorAll("[data-nk]")].every((n) => n.childElementCount > 0));
  await page.waitForTimeout(300);
  return errors;
}

/** Text that runs past an ancestor with overflow hidden or clip. A scrolling ancestor ends the search, since its
    content can be reached. Visually hidden text (a 1px clip box) is skipped. Ids are "tag.first-class". */
function clippedText(): string[] {
  const out: string[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || !n.textContent?.trim()) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility !== "visible" || el.closest("[aria-hidden='true'],[inert]")) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    const rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
    if (!rects.length) continue;
    const slack = parseFloat(cs.fontSize) * 0.25; // a glyph box overhangs a tight line height vertically
    for (let a = el as Element | null; a && a !== document.documentElement; a = a.parentElement) {
      const s = getComputedStyle(a);
      const x = s.overflowX, y = s.overflowY;
      if ([x, y].some((v) => v === "auto" || v === "scroll")) break;
      if (![x, y].some((v) => v === "hidden" || v === "clip")) continue;
      const b = a.getBoundingClientRect();
      if (b.width <= 2 || b.height <= 2) break;
      const left = b.left + a.clientLeft, top = b.top + a.clientTop;
      const right = left + a.clientWidth, bottom = top + a.clientHeight;
      const cut = rects.some((r) =>
        ((x === "hidden" || x === "clip") && (r.left < left - 1 || r.right > right + 1)) ||
        ((y === "hidden" || y === "clip") && (r.top < top - slack || r.bottom > bottom + slack)));
      if (cut) { out.push(`${el.tagName.toLowerCase()}${el.classList[0] ? "." + el.classList[0] : ""}`); break; }
    }
  }
  return out;
}

const errorId = (m: string) => { const r = /error #(\d+)/.exec(m); return r ? `react-${r[1]}` : m.slice(0, 80); };

for (const path of pages()) {
  for (const theme of THEMES) {
    test(`${path} ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      const errors = await open(page, path, theme);
      // A failed hydration re-renders <html> from the server copy, which says dark. Record that, then put the
      // reader's theme back so the checks below still test the theme they name.
      const lost = await page.evaluate((t) => document.documentElement.dataset.theme !== t, theme);
      gate("theme", theme, path, lost ? ["theme-lost"] : []);
      if (lost) {
        await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);
        await page.waitForTimeout(300);
      }
      if (!COLLECT) await expect(page).toHaveScreenshot(`${slug(path)}-${theme}.png`);
      gate("clipped", theme, path, await page.evaluate(clippedText));
      gate("errors", theme, path, errors.map(errorId));
      await page.addScriptTag({ content: AXE });
      const axe = await page.evaluate(async () => {
        const r = await (window as any).axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] });
        return r.violations.map((v: any) => v.id as string);
      });
      gate("axe", theme, path, axe);
    });
  }

  test(`${path} metadata`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const m = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
      image: document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "",
      icon: document.querySelector('link[rel="icon"]')?.getAttribute("href") ?? "",
    }));
    const found: string[] = [];
    if (m.description.length < 120 || m.description.length > 160) found.push(`description-length-${m.description.length}`);
    if (!m.image) found.push("no-og-image");
    if (!m.icon) found.push("no-icon");
    const missing = path === "/no-such-page/";
    if (missing ? !/not found/i.test(m.title) : !m.canonical.endsWith(path)) found.push(missing ? "404-title" : "no-canonical");
    gate("meta", "any", path, found);
  });

  test(`${path} reflow at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await open(page, path, "dark");
    const wide = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    gate("reflow", "any", path, wide ? ["horizontal-scroll"] : []);
  });
}

test("known-issues.json names a fix-list row for every entry", () => {
  for (const k of KNOWN) expect(k.fix, `${k.check} ${k.page} ${k.id}`).toMatch(/^\d+\.\d+$/);
});

test("phone menu: Escape closes it and focus goes back to the button", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/", { waitUntil: "networkidle" });
  const button = page.locator("button.menu");
  await button.click();
  await expect(page.locator("#m-nav")).toBeVisible();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  await expect(page.locator("#m-nav")).toBeHidden();
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute("aria-expanded", "false");
});

test("contents: the section being read is marked, and phones get the list at the top", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/get-started/", { waitUntil: "networkidle" });
  // Bring the second section's heading to 100px from the top: it is then the one being read.
  const id = await page.evaluate(() => {
    const h = document.querySelectorAll(".dbody .prose h2")[1] as HTMLElement;
    window.scrollTo(0, window.scrollY + h.getBoundingClientRect().top - 100);
    return h.id;
  });
  await page.waitForTimeout(200);
  await expect(page.locator(`.dbody .toc a[href="#${id}"]`)).toHaveAttribute("aria-current", "location");
  await expect(page.locator(".dbody .toc a[aria-current]")).toHaveCount(1);
  await page.setViewportSize({ width: 390, height: 800 });
  await expect(page.locator(".toc-phone summary")).toBeVisible();
});

test("a tooltip opened in a preview lands inside <main>", async ({ page }) => {
  await page.goto("/components/tooltip/", { waitUntil: "networkidle" });
  const outside = await page.evaluate(() => [...document.querySelectorAll(".nk-tooltip")].filter((t) => !t.closest("main")).length);
  expect(outside).toBe(0);
});
