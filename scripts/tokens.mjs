// Naksha token engine. Reads the DTCG 2025.10 source through its resolver,
// resolves aliases, and formats values for each platform. No dependencies.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NS = "dev.naksha";

/** Load the resolver and return { base, themes: { light, dark }, files }. */
export function loadSource(tokensDir) {
  const resolver = readJSON(join(tokensDir, "naksha.resolver.json"));
  const load = (refs) => refs.map((r) => ({ file: r.$ref, tree: readJSON(join(tokensDir, r.$ref)) }));
  const base = Object.values(resolver.sets).flatMap((s) => load(s.sources));
  const mod = resolver.modifiers.theme;
  const themes = {};
  for (const [name, refs] of Object.entries(mod.contexts)) themes[name] = load(refs);
  return { resolver, base, themes, defaultTheme: mod.default };
}

function readJSON(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

/**
 * Flatten a list of token files into a Map of dotted path -> token.
 * Group $type is inherited. A later file may not redefine an earlier path.
 */
export function flatten(files) {
  const out = new Map();
  const walk = (node, path, type, file) => {
    const t = node.$type ?? type;
    if ("$value" in node) {
      const key = path.join(".");
      if (out.has(key)) throw new Error(`Duplicate token ${key} in ${file} (first in ${out.get(key).file})`);
      out.set(key, {
        path: [...path],
        name: path.join("-"),
        type: t,
        value: node.$value,
        description: node.$description ?? "",
        ext: node.$extensions?.[NS] ?? {},
        file,
      });
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("$") || typeof v !== "object" || v === null) continue;
      walk(v, [...path, k], t, file);
    }
  };
  for (const { file, tree } of files) walk(tree, [], undefined, file);
  return out;
}

/** Build the token map for one theme: base files plus that theme's files. */
export function tokensFor(src, theme) {
  return flatten([...src.base, ...src.themes[theme]]);
}

const ALIAS = /^\{([^{}]+)\}$/;
export const isAlias = (v) => typeof v === "string" && ALIAS.test(v);
export const aliasPath = (v) => v.match(ALIAS)[1];

/** Fully resolve a value (aliases at any depth inside composites). Throws on missing or circular refs. */
export function resolveValue(map, value, seen = []) {
  if (isAlias(value)) {
    const p = aliasPath(value);
    if (seen.includes(p)) throw new Error(`Circular alias: ${[...seen, p].join(" -> ")}`);
    const t = map.get(p);
    if (!t) throw new Error(`Unresolved alias {${p}}${seen.length ? ` (from ${seen.at(-1)})` : ""}`);
    return resolveValue(map, t.value, [...seen, p]);
  }
  if (Array.isArray(value)) return value.map((v) => resolveValue(map, v, seen));
  if (value && typeof value === "object") {
    const o = {};
    for (const [k, v] of Object.entries(value)) o[k] = resolveValue(map, v, seen);
    return o;
  }
  return value;
}

/** Resolve one token and keep the type of the token it lands on. */
export function resolveToken(map, token) {
  return resolveValue(map, token.value, [token.path.join(".")]);
}

// ---------- formatting ----------

const hex2 = (n) => Math.round(n).toString(16).padStart(2, "0");
const trim = (n) => Number(Number(n).toFixed(4)).toString();

export function colorHex(c) {
  const base = c.hex ?? "#" + c.components.map((x) => hex2(x * 255)).join("");
  return c.alpha !== undefined && c.alpha < 1 ? base + hex2(c.alpha * 255) : base;
}
export function colorRGBA(c) {
  const [r, g, b] = c.components;
  return { r, g, b, a: c.alpha ?? 1 };
}
const dim = (d) => `${trim(d.value)}${d.unit}`;
const GENERIC = new Set(["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-monospace", "ui-sans-serif", "ui-serif", "math", "emoji"]);
export const fontStack = (list) => list.map((f) => (GENERIC.has(f) ? f : `"${f}"`)).join(", ");
const shadowLayer = (s) => {
  const { r, g, b, a } = colorRGBA(s.color);
  const rgb = [r, g, b].map((x) => Math.round(x * 255)).join(",");
  return `${dim(s.offsetX)} ${dim(s.offsetY)} ${dim(s.blur)} ${dim(s.spread)} rgba(${rgb},${trim(a)})`.replace(/\b0px\b/g, "0");
};

/** CSS text for a resolved value of a given type. */
export function cssValue(type, v, ext = {}) {
  switch (type) {
    case "color": return colorHex(v);
    case "dimension": return dim(v);
    case "duration": return dim(v);
    case "number": return ext.unit ? `${v}${ext.unit}` : String(v);
    case "fontWeight": return String(v);
    case "fontFamily": return fontStack(v);
    case "cubicBezier": return `cubic-bezier(${v.map(trim).join(", ")})`;
    case "shadow": return (Array.isArray(v) ? v : [v]).map(shadowLayer).join(", ");
    default: throw new Error(`No CSS formatter for $type ${type}`);
  }
}

/** CSS for a token: var() if it aliases another token of the same kind, else the literal. */
export function cssDecl(map, token) {
  if (isAlias(token.value)) return `var(--${aliasPath(token.value).replaceAll(".", "-")})`;
  return cssValue(token.type, resolveToken(map, token), token.ext);
}

// ---------- WCAG ----------

export function luminance({ r, g, b }) {
  const f = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
/** Composite a (possibly translucent) colour over an opaque one. */
export function over(top, bottom) {
  const a = top.a;
  return { r: top.r * a + bottom.r * (1 - a), g: top.g * a + bottom.g * (1 - a), b: top.b * a + bottom.b * (1 - a), a: 1 };
}
export function contrast(fg, bg) {
  const solid = fg.a < 1 ? over(fg, bg) : fg;
  const [l1, l2] = [luminance(solid), luminance(bg)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

export const here = (url) => dirname(fileURLToPath(url));
