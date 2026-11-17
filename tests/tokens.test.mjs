import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { loadSource, tokensFor, resolveToken, colorRGBA, contrast, flatten, here } from "../scripts/tokens.mjs";
import { build } from "../scripts/build.mjs";

const ROOT = resolve(here(import.meta.url), "..");
const SRC = join(ROOT, "tokens");
const source = loadSource(SRC);
const themes = Object.keys(source.themes);
const maps = Object.fromEntries(themes.map((t) => [t, tokensFor(source, t)]));

test("every token resolves in every theme, with no cycles", () => {
  for (const th of themes) for (const t of maps[th].values()) assert.doesNotThrow(() => resolveToken(maps[th], t), `${th}: ${t.path.join(".")}`);
});

test("every token has a $type and a valid DTCG value shape", () => {
  const UNITS = { dimension: ["px", "rem"], duration: ["ms", "s"] };
  for (const t of maps.light.values()) {
    assert.ok(t.type, `${t.path.join(".")} has no $type`);
    const v = resolveToken(maps.light, t);
    if (t.type === "color") {
      assert.equal(v.colorSpace, "srgb", t.name);
      assert.equal(v.components.length, 3, t.name);
      for (const c of v.components) assert.ok(c >= 0 && c <= 1, `${t.name} component out of range`);
    }
    if (UNITS[t.type]) assert.ok(UNITS[t.type].includes(v.unit), `${t.name} unit ${v.unit}`);
    if (t.type === "cubicBezier") assert.ok(v.length === 4 && v[0] >= 0 && v[0] <= 1 && v[2] >= 0 && v[2] <= 1, t.name);
  }
});

test("every theme defines the same token names", () => {
  const names = themes.map((th) => [...maps[th].keys()].sort().join());
  assert.ok(names.every((n) => n === names[0]));
});

test("CSS names are unique and kebab-case", () => {
  const seen = new Set();
  for (const t of maps.light.values()) {
    assert.match(t.name, /^[a-z][a-z0-9-]*[a-z0-9]$/, t.name);
    assert.ok(!seen.has(t.name), `duplicate CSS name ${t.name}`);
    seen.add(t.name);
  }
});

test("semantic tokens alias primitives instead of holding raw values", () => {
  for (const th of themes) for (const t of maps[th].values()) {
    if (t.type !== "color" || !source.themes[th].some((f) => f.file === t.file)) continue;
    assert.equal(typeof t.value, "string", `${th}: ${t.name} holds a raw colour`);
  }
});

// WCAG 2.2: 1.4.3 text (4.5:1), 1.4.11 non-text UI (3:1).
const TEXT = 4.5, UI = 3;
const PAIRS = [
  ...["fg.default", "fg.muted"].flatMap((fg) => ["bg.canvas", "bg.subtle", "bg.raised"].map((bg) => [fg, bg, TEXT])),
  ["fg.subtle", "bg.canvas", TEXT], ["fg.subtle", "bg.raised", TEXT],
  ["fg.on-inverse", "bg.inverse", TEXT], ["fg.on-inverse-muted", "bg.inverse", TEXT],
  ...["action.primary", "action.primary-hover", "action.primary-pressed"].map((bg) => ["action.on-primary", bg, TEXT]),
  ...["action.highlight", "action.highlight-hover", "action.highlight-pressed"].map((bg) => ["action.on-highlight", bg, TEXT]),
  ...["action.danger", "action.danger-hover", "action.danger-pressed"].map((bg) => ["action.on-danger", bg, TEXT]),
  ...["success", "warning", "danger", "info"].flatMap((s) => [[`status.${s}-fg`, `status.${s}-bg`, TEXT], [`status.${s}-fg`, "bg.canvas", TEXT]]),
  ...["bg.canvas", "bg.subtle", "bg.raised"].flatMap((bg) => [["border.control", bg, UI], ["border.focus", bg, UI]]),
  ["spec.redline", "bg.canvas", TEXT],
  ["fg.default", "selection", TEXT],
];

for (const th of themes) {
  test(`contrast holds in ${th}`, () => {
    const m = maps[th];
    const rgba = (p) => {
      const t = m.get(p);
      assert.ok(t, `missing ${p}`);
      return colorRGBA(resolveToken(m, t));
    };
    const fails = [];
    for (const [fg, bg, min] of PAIRS) {
      const r = contrast(rgba(fg), rgba(bg));
      if (r < min) fails.push(`${fg} on ${bg}: ${r.toFixed(2)} < ${min}`);
    }
    assert.deepEqual(fails, []);
  });
}

// Pairs that fail on purpose. Each must say so in its $description, and components must not use them.
const NOT_ALLOWED = [["fg.subtle", "bg.subtle"]];

test("pairs that fail contrast are documented and unused in components", () => {
  const css = readFileSync(join(ROOT, "css/components.css"), "utf8");
  for (const [fg, bg] of NOT_ALLOWED) {
    for (const th of themes) assert.match(maps[th].get(fg).description, new RegExp(`Not on ${bg.replace(".", "-")}`), `${th}: ${fg} must warn about ${bg}`);
    const fgVar = `var(--${fg.replace(".", "-")})`, bgVar = `var(--${bg.replace(".", "-")})`;
    for (const rule of css.split("}")) {
      assert.ok(!(rule.includes(`color: ${fgVar}`) && rule.includes(`background: ${bgVar}`)), `components.css uses ${fg} on ${bg}: ${rule.trim().slice(0, 80)}`);
    }
  }
});

test("one token change reaches CSS, JS and the artifact", () => {
  const tmp = mkdtempSync(join(tmpdir(), "naksha-"));
  cpSync(SRC, join(tmp, "tokens"), { recursive: true });
  const p = join(tmp, "tokens/primitives/color.tokens.json");
  const prim = JSON.parse(readFileSync(p, "utf8"));
  prim.stone["200"].$value = { colorSpace: "srgb", components: [1, 0, 0], hex: "#ff0000" };
  writeFileSync(p, JSON.stringify(prim));
  const out = join(tmp, "dist");
  build(join(tmp, "tokens"), out);

  const css = readFileSync(join(out, "css/naksha.css"), "utf8");
  assert.match(css, /--stone-200: #ff0000;/);
  assert.match(css, /--bg-canvas: var\(--stone-200\);/, "semantic token keeps its alias in CSS");

  const js = readFileSync(join(out, "js/tokens.js"), "utf8");
  assert.match(js, /"bg-canvas": "#ff0000"/, "JS resolves the alias");

  const art = JSON.parse(readFileSync(join(out, "artifact/tokens.json"), "utf8"));
  assert.equal(art.color.tokens.find((t) => t.name === "stone-200").value, "#ff0000");
  assert.match(readFileSync(join(out, "artifact/tokens.css"), "utf8"), /--stone-200: #ff0000;/);
  assert.equal(art.color.tokens.find((t) => t.name === "bg-canvas").value.light, "{stone-200}", "artifact keeps the alias");
});

test("a broken alias fails the build", () => {
  assert.throws(() => resolveToken(flatten([{ file: "x", tree: { a: { $type: "color", $value: "{nope.missing}" } } }]), { value: "{nope.missing}", path: ["a"] }), /Unresolved alias/);
});

test("the artifact output is complete", () => {
  const tmp = mkdtempSync(join(tmpdir(), "naksha-"));
  build(SRC, tmp);
  const a = join(tmp, "artifact");
  for (const f of ["tokens.json", "tokens.css", "README.md", "CHANGELOG.md", "design-system.json", "components/bundle.css", "fonts/Archivo-Variable.woff2"]) assert.ok(existsSync(join(a, f)), `missing ${f}`);
  assert.match(readFileSync(join(a, "tokens.css"), "utf8").split("\n")[0], /^\/\* .+ — generated from tokens\.json \*\/$/);
  for (const c of readdirSync(join(a, "components")).filter((d) => !d.includes("."))) {
    const html = readFileSync(join(a, "components", c, "preview.html"), "utf8");
    assert.match(html.split("\n")[0], /^<!-- @dsCard /, `${c} preview needs the @dsCard marker on line 1`);
  }
});

test("fluid layout tokens: clamp in naksha.css, fixed largest value in the artifact", () => {
  const tmp = mkdtempSync(join(tmpdir(), "naksha-"));
  build(SRC, tmp);
  const css = readFileSync(join(tmp, "css/naksha.css"), "utf8");
  assert.match(css, /--layout-gutter: clamp\(1rem, 0\.55rem \+ 1\.9vw, 2\.5rem\);/);
  assert.match(css, /--layout-section: calc\(var\(--layout-unit\) \* 8\);/);
  const art = readFileSync(join(tmp, "artifact/tokens.css"), "utf8");
  assert.match(art, /--layout-gutter: 40px;/);
  for (const t of maps.light.values()) if (t.ext.fluid) assert.ok(t.ext.min, `${t.name} is fluid but has no min`);
});
