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
        return r.violations.filter((v: any) => v.impact === "serious" || v.impact === "critical").map((v: any) => `${v.id}: ${v.nodes.length} at ${v.nodes.slice(0, 3).map((n: any) => n.target.join(" ")).join(", ")}`);
      });
      expect(serious, "axe: no serious or critical issues").toEqual([]);
    });
  }
}

// Windows High Contrast: controls must keep visible edges, focus and selection.
const FORCED = ["Button", "IconButton", "ToggleButton", "CopyButton", "Input", "Textarea", "Checkbox", "Radio", "Switch", "SegmentedControl", "Slider", "Tabs", "Select", "DropdownMenu", "Table", "ListItem", "Image", "TopNav", "Skeleton", "PromptInput", "ProgressBar"];
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
  const target = page.locator(".nk-btn--primary").first();
  const box = (await target.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const pressed = await target.evaluate((el) => getComputedStyle(el).transform);
  await page.mouse.up();
  expect(pressed, "a press does not scale under reduced motion").toBe("none");
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

test("live Button: a pointer press scales, a keyboard press only changes colour", async ({ page }) => {
  await page.goto(framed("Button", "light"));
  const b = page.locator(".nk-btn--primary").first();
  const box = (await b.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(250);
  expect(await b.evaluate((el) => getComputedStyle(el).transform)).not.toBe("none");
  await page.mouse.up();
  await page.mouse.move(0, 0);
  await b.focus();
  await page.keyboard.down(" ");
  await page.waitForTimeout(250);
  const kb = await b.evaluate((el) => ({ t: getComputedStyle(el).transform, pressed: el.hasAttribute("data-pressed") }));
  await page.keyboard.up(" ");
  expect(kb.pressed, "React Aria marks the keyboard press").toBe(true);
  expect(kb.t, "but nothing moves").toBe("none");
});

test("live PromptInput: grows from two lines to eight, then scrolls", async ({ page }) => {
  await page.goto(framed("PromptInput", "light"));
  const t = page.locator(".nk-prompt__text").first();
  const start = await t.evaluate((el) => el.getBoundingClientRect().height);
  await t.fill("one\ntwo\nthree\nfour");
  const four = await t.evaluate((el) => el.getBoundingClientRect().height);
  await t.fill(Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join("\n"));
  const many = await t.evaluate((el) => ({ h: el.getBoundingClientRect().height, max: parseFloat(getComputedStyle(el).maxHeight), scrolls: el.scrollHeight > el.clientHeight }));
  expect(four).toBeGreaterThan(start);
  expect(many.h).toBeCloseTo(many.max, 0);
  expect(many.scrolls).toBe(true);
});

test("live PromptInput: Enter is held back while an IME is composing", async ({ page }) => {
  await page.goto(framed("PromptInput", "light"));
  const t = page.locator(".nk-prompt__text").first();
  await t.fill("नमस्ते");
  const prevented = await t.evaluate((el) => {
    const ev = new KeyboardEvent("keydown", { key: "Enter", isComposing: true, bubbles: true, cancelable: true });
    el.dispatchEvent(ev);
    const ev2 = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    el.dispatchEvent(ev2);
    return { composing: ev.defaultPrevented, plain: ev2.defaultPrevented };
  });
  expect(prevented).toEqual({ composing: false, plain: true });
});

test("live Select: the list opens under the trigger, as wide as it, and closes on Escape", async ({ page }) => {
  await page.goto(framed("Select", "light"));
  const trigger = page.locator(".nk-control--select").first();
  await trigger.click();
  const list = page.locator(".nk-popover .nk-menu--select");
  await expect(list).toBeVisible();
  await page.waitForTimeout(300); // let the pop-in finish before measuring
  const [t, l] = [(await trigger.boundingBox())!, (await list.boundingBox())!];
  expect(await trigger.evaluate((el) => getComputedStyle(el).boxShadow), "the trigger keeps its focus edge while open").not.toBe("none");
  expect(Math.round(l.width)).toBe(Math.round(t.width));
  expect(Math.round(l.x)).toBe(Math.round(t.x));
  expect(Math.round(l.y - (t.y + t.height))).toBe(4);
  await page.keyboard.press("Escape");
  await expect(list).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("live form controls: keyboard focus shows the ring on the drawn box", async ({ page }) => {
  await page.goto(framed("Checkbox", "light"));
  await page.keyboard.press("Tab");
  const ring = await page.evaluate(() => getComputedStyle(document.querySelector(".nk-check[data-focus-visible] .nk-check__box")!).outlineStyle);
  expect(ring).toBe("solid");
});

test("live Textarea: grows with the text to sixteen lines, then scrolls", async ({ page }) => {
  await page.goto(framed("Textarea", "light"));
  const t = page.locator(".nk-control--area textarea").first();
  const start = await t.evaluate((el) => el.getBoundingClientRect().height);
  await t.fill(Array.from({ length: 8 }, (_, i) => `line ${i + 1}`).join("\n"));
  const eight = await t.evaluate((el) => el.getBoundingClientRect().height);
  await t.fill(Array.from({ length: 40 }, (_, i) => `line ${i + 1}`).join("\n"));
  const many = await t.evaluate((el) => ({ h: el.getBoundingClientRect().height, max: parseFloat(getComputedStyle(el).maxHeight), scrolls: el.scrollHeight > el.clientHeight }));
  await t.fill("");
  const back = await t.evaluate((el) => el.getBoundingClientRect().height);
  expect(eight).toBeGreaterThan(start);
  expect(many.h).toBeCloseTo(many.max, 0);
  expect(many.scrolls).toBe(true);
  expect(back, "shrinks back when the text is cleared").toBeCloseTo(start, 0);
});

test("live DropdownMenu: opens from the keyboard into the list, Escape returns focus", async ({ page }) => {
  await page.goto(framed("PromptInput", "light"));
  const trigger = page.locator(".nk-prompt__level").first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const menu = page.locator(".nk-popover .nk-menu");
  await expect(menu).toBeVisible();
  // A choice menu opens on the current choice.
  await expect(page.locator(".nk-popover [aria-checked=true]")).toBeFocused();
  expect(await page.locator(".nk-popover [aria-checked=true]").textContent()).toContain("Everyday");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("live Modal: focus moves in and stays, the page behind is hidden, Escape returns focus", async ({ page }) => {
  await page.goto(framed("Button", "light"));
  await page.evaluate(() => {
    const N = (window as any).Naksha, R = (window as any).React, D = (window as any).ReactDOM;
    const host = document.createElement("div");
    host.id = "modal-host";
    document.body.append(host);
    const h = R.createElement;
    D.createRoot(host).render(
      h(N.ModalTrigger, null,
        h(N.Button, { variant: "primary" }, "Review change"),
        h(N.Modal, { title: "Agree to this change?", footer: (close: () => void) => h(N.Button, { onPress: close }, "Not now") }, "The rent moves up by 5% from 1 January.")),
    );
  });
  const trigger = page.getByRole("button", { name: "Review change" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Agree to this change?" });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  }
  expect(await page.evaluate(() => document.querySelector(".nk-stage")!.closest("[aria-hidden=true], [inert]") !== null), "the page behind is hidden").toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("live Tooltip: keyboard focus shows it at once, 6 above its trigger", async ({ page }) => {
  await page.goto(framed("IconButton", "light"));
  await page.evaluate(() => {
    const N = (window as any).Naksha, R = (window as any).React, D = (window as any).ReactDOM;
    const host = document.createElement("div");
    host.id = "tip-host";
    host.style.cssText = "position:fixed;left:200px;top:200px";
    document.body.prepend(host);
    D.createRoot(host).render(R.createElement(N.Tooltip, { content: "Copy link", shortcut: "⌘C" }, R.createElement(N.IconButton, { label: "Copy link", icon: "link", variant: "ghost" })));
  });
  const btn = page.locator("#tip-host .nk-iconbtn");
  await page.keyboard.press("Tab");
  await expect(btn).toBeFocused();
  const tip = page.getByRole("tooltip");
  await expect(tip).toBeVisible();
  await page.waitForTimeout(300);
  const [b, t] = [(await btn.boundingBox())!, (await tip.boundingBox())!];
  expect(Math.round(b.y - (t.y + t.height))).toBe(6);
  await page.keyboard.press("Escape");
  await expect(tip).toHaveCount(0);
});

async function mountToaster(page: import("@playwright/test").Page) {
  await page.goto(framed("Button", "light"));
  await page.evaluate(() => {
    const N = (window as any).Naksha, R = (window as any).React, D = (window as any).ReactDOM;
    const host = document.createElement("div");
    document.body.append(host);
    D.createRoot(host).render(R.createElement(N.Toaster));
  });
}

test("live Toast: stacks 8 apart and 5% smaller, spreads on hover, pauses while hovered", async ({ page }) => {
  await mountToaster(page);
  await page.evaluate(() => {
    const t = (window as any).Naksha.toast;
    t("First", { duration: 1500 });
    t("Second", { duration: 1500 });
    t("Third", { duration: 1500 });
  });
  const toasts = page.locator(".nk-toaster .nk-toast");
  await expect(toasts).toHaveCount(3);
  await page.waitForTimeout(500);
  const rest = await toasts.evaluateAll((els) => els.map((e) => ({ text: e.textContent, front: e.hasAttribute("data-front"), y: e.getBoundingClientRect().top, w: e.getBoundingClientRect().width })));
  expect(rest[0]!.text).toContain("Third");
  expect(rest[0]!.front).toBe(true);
  expect(Math.round(rest[0]!.y - rest[1]!.y)).toBe(8);
  expect(rest[1]!.w / rest[0]!.w).toBeCloseTo(0.95, 2);
  const front = toasts.first();
  await front.hover();
  await page.waitForTimeout(500);
  const spread = await toasts.evaluateAll((els) => els.map((e) => e.getBoundingClientRect()));
  expect(Math.round(spread[0]!.top - spread[1]!.bottom)).toBe(8);
  expect(Math.round(spread[1]!.width)).toBe(Math.round(spread[0]!.width));
  await page.waitForTimeout(1500);
  await expect(toasts, "timers wait while the stack is hovered").toHaveCount(3);
  await page.mouse.move(900, 50);
  await expect(toasts).toHaveCount(0, { timeout: 4000 });
});

test("live Toast: swipe down dismisses; a short drag springs back", async ({ page }) => {
  await mountToaster(page);
  await page.evaluate(() => (window as any).Naksha.toast("Link copied", { duration: Infinity }));
  const t = page.locator(".nk-toaster .nk-toast").first();
  await page.waitForTimeout(400);
  const b = (await t.boundingBox())!;
  await page.mouse.move(b.x + 40, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + 40, b.y + b.height / 2 + 4, { steps: 2 });
  await page.waitForTimeout(200);
  await page.mouse.up();
  await page.waitForTimeout(400);
  await expect(t).toHaveCount(1);
  await page.mouse.move(b.x + 40, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + 40, b.y + b.height / 2 + 60, { steps: 6 });
  await page.mouse.up();
  await expect(page.locator(".nk-toaster .nk-toast")).toHaveCount(0, { timeout: 2000 });
});

test("live Toast under reduced motion: it fades in place, nothing slides", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await mountToaster(page);
  await page.evaluate(() => (window as any).Naksha.toast("Link copied"));
  const t = page.locator(".nk-toaster .nk-toast").first();
  const props = await t.evaluate((el) => getComputedStyle(el).transitionProperty);
  expect(props).not.toContain("transform");
  expect(props).toContain("opacity");
});

test("live ChatMessage: Chrome names sources by number; arrow keys move through the thread", async ({ page }) => {
  await page.goto(framed("ChatMessage", "light"));
  await expect(page.getByRole("button", { name: /^Source\s*1\s*:\s*Schedule A, clause 4\.2$/ })).toBeVisible();
  const articles = page.getByRole("article");
  await expect(articles).toHaveCount(4);
  await articles.last().focus();
  await page.keyboard.press("Home");
  await expect(articles.first()).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("article", { name: "garu said" }).first()).toBeFocused();
});

test("live Thread: stays at the newest message while you are there, never steals focus", async ({ page }) => {
  await page.goto(framed("SuggestionChip", "light"));
  await page.evaluate(() => {
    const N = (window as any).Naksha, R = (window as any).React, D = (window as any).ReactDOM;
    const host = document.createElement("div");
    host.style.cssText = "height:300px;display:flex;flex-direction:column";
    host.id = "thread-host";
    document.body.append(host);
    const root = D.createRoot(host);
    (window as any).__render = (n: number) =>
      root.render(R.createElement(N.Thread, null, Array.from({ length: n }, (_, i) => R.createElement(N.ChatMessage, { key: i, from: i % 2 ? "assistant" : "user", name: "garu" }, `message ${i + 1} `.repeat(20)))));
    (window as any).__render(6);
  });
  const feed = page.locator("#thread-host .nk-thread");
  const gap = () => feed.evaluate((el) => el.scrollHeight - el.scrollTop - el.clientHeight);
  expect(await gap()).toBeLessThan(2);
  const chip = page.locator(".nk-chip").first();
  await chip.focus();
  await page.evaluate(() => (window as any).__render(7));
  expect(await gap(), "a new message keeps the view at the end").toBeLessThan(2);
  await expect(chip, "and focus stays where the person left it").toBeFocused();
  await feed.evaluate((el) => (el.scrollTop = 0));
  await feed.dispatchEvent("scroll");
  await page.evaluate(() => (window as any).__render(8));
  expect(await feed.evaluate((el) => el.scrollTop), "reading older messages: the view stays put").toBe(0);
});
