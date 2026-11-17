import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { previews, framed } from "./frame";

const AXE = readFileSync(resolve("node_modules/axe-core/axe.min.js"), "utf8");
const THEMES = ["light", "dark"] as const;

for (const p of previews()) {
  for (const theme of THEMES) {
    test(`${p.name} ${theme}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
      await page.setViewportSize({ width: p.width, height: Math.max(p.height, 120) });
      await page.goto(framed(p.name, theme));
      await page.evaluate(() => document.fonts.ready);
      expect(errors, "no errors while rendering").toEqual([]);
      expect(await page.evaluate(() => typeof (window as any).Naksha), "bundle loaded").toBe("object");
      await expect(page).toHaveScreenshot(`${p.name}-${theme}.png`, { fullPage: true });

      await page.addScriptTag({ content: AXE });
      const serious = await page.evaluate(async () => {
        const r = await (window as any).axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] });
        return r.violations.filter((v: any) => v.impact === "serious" || v.impact === "critical").map((v: any) => `${v.id}: ${v.nodes.length}`);
      });
      expect(serious, "axe: no serious or critical issues").toEqual([]);
    });
  }
}

// Windows High Contrast: controls must keep visible edges, focus and selection.
const FORCED = ["Button", "IconButton", "Input", "Checkbox", "Radio", "Switch", "SegmentedControl", "Tabs", "Select", "DropdownMenu", "Table", "TopNav", "Skeleton", "PromptInput", "ProgressBar"];
for (const name of FORCED) {
  test(`${name} forced colours`, async ({ page }) => {
    const p = previews().find((x) => x.name === name)!;
    await page.emulateMedia({ forcedColors: "active" });
    await page.setViewportSize({ width: p.width, height: Math.max(p.height, 120) });
    await page.goto(framed(name, "light"));
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${name}-forced.png`, { fullPage: true });
  });
}

test("reduced motion: nothing moves, state still changes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(framed("Button", "light"));
  const btn = await page.evaluate(() => getComputedStyle(document.querySelector(".nk-btn")!).transitionProperty);
  expect(btn).not.toContain("transform");
  expect(btn).toContain("background-color");
  await page.goto(framed("ProgressBar", "light"));
  const bar = await page.evaluate(() => getComputedStyle(document.querySelector(".nk-progress--indeterminate .nk-progress__bar")!).animationName);
  expect(bar).toBe("nk-pulse");
});

test("cascade layers: a product's own CSS wins without !important", async ({ page }) => {
  await page.goto(framed("Button", "light"));
  await page.addStyleTag({ content: ".nk-btn--primary { background: rgb(1, 2, 3); transition: none; }" });
  const bg = await page.evaluate(() => getComputedStyle(document.querySelector(".nk-btn--primary")!).backgroundColor);
  expect(bg).toBe("rgb(1, 2, 3)");
});
