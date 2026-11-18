import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { GROUP_ORDER, type Group } from "./groups";

/* Everything on the site is read from the repo at build time. Nothing here is written by hand. */
export const REPO = path.join(process.cwd(), "..");
const read = (p: string) => readFileSync(path.join(REPO, p), "utf8");

export const VERSION: string = JSON.parse(read("package.json")).version;
export const GITHUB = "https://github.com/shreeraj301/naksha";

marked.setOptions({ gfm: true });
/* Code blocks scroll sideways, so each takes Tab focus: keyboard users can then scroll it with the arrow keys. */
export const md = (s: string) => (marked.parse(s, { async: false }) as string).replaceAll("<pre>", '<pre tabindex="0">');

/** Markdown to one line of plain text, for summaries and answers. */
export function plain(s: string) {
  return s
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*] /gm, "")
    .replace(/\s+/g, " ")
    .trim();
}
export const firstSentence = (s: string) => { const p = plain(s); const m = p.match(/^.*?[.!?](\s|$)/); return (m ? m[0] : p).trim(); };
export const slugOf = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
export const anchor = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export interface Section { id: string; title: string; md: string; html: string }
export interface ComponentDoc {
  name: string; slug: string; group: Group; intro: string; introHtml: string; summary: string;
  sections: Section[]; preview: string; readme: string; phase: string; changed: string;
}

function splitSections(body: string): { intro: string; sections: Section[] } {
  const parts = body.split(/^## /m);
  const intro = parts.shift()!.trim();
  const sections = parts.map((p) => {
    const nl = p.indexOf("\n");
    const title = p.slice(0, nl).trim();
    const text = p.slice(nl + 1).trim();
    return { id: anchor(title), title, md: text, html: md(text) };
  });
  return { intro, sections };
}

export function componentNames(): string[] {
  return JSON.parse(read("src/components.json"));
}

/** React components only: components.json also lists announce(), which is a function. */
export const componentCount = () => componentNames().filter((n) => /^[A-Z]/.test(n)).length;

let cache: ComponentDoc[] | null = null;
export function components(): ComponentDoc[] {
  if (cache) return cache;
  cache = componentNames().map((name) => {
    const readme = read(`artifact/components/${name}/README.md`);
    const html = existsSync(path.join(REPO, `artifact/components/${name}/preview.html`)) ? read(`artifact/components/${name}/preview.html`) : "";
    const group = (html.match(/@dsCard group="([^"]+)"/)?.[1] ?? "Identity") as Group;
    const body = readme.replace(/^# .*\n/, "");
    const { intro, sections } = splitSections(body);
    // The preview is the body up to the mount script. A card's own helpers (<script data-nk-fn>) stay in: LivePreview runs them.
    const bodyStart = html.indexOf("<body>"), mount = html.slice(bodyStart).search(/<script(?! data-nk-fn)/), firstScript = mount >= 0 ? bodyStart + mount : -1;
    const preview = bodyStart >= 0 ? html.slice(bodyStart + 6, firstScript > 0 ? firstScript : undefined).trim() : "";
    const phase = plain(sections.find((s) => s.title === "Release phase")?.md ?? "");
    const log = sections.find((s) => s.title === "Change log")?.md ?? "";
    const row = log.split("\n").find((l) => /^\|\s*\d/.test(l));
    const changed = row ? row.split("|").map((c) => c.trim()).filter(Boolean).join(": ") : "";
    return { name, slug: slugOf(name), group, intro, introHtml: md(intro), summary: firstSentence(intro), sections, preview, readme, phase, changed: plain(changed) };
  }).sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group));
  return cache;
}
export const component = (slug: string) => components().find((c) => c.slug === slug);

/** Questions a component page can answer, each quoted from its own README section. */
export interface Ask { ask: string; steps: [string, string][]; say: string; build: string; sources: string[] }
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export function asksFor(c: ComponentDoc): Ask[] {
  const sec = (t: string) => c.sections.find((s) => s.title === t);
  const out: Ask[] = [];
  const bp = sec("Best practices");
  if (bp) {
    const items = bp.md.split("\n").filter((l) => /^[-*] /.test(l)).slice(0, 2).map(plain);
    if (items.length) out.push({ ask: `When do I use ${c.name}?`, steps: [[`Reading ${c.name}, best practices`, "1 section"]], say: items.join(" "), build: "answer", sources: ["Best practices"] });
  }
  const content = sec("Content");
  if (content) out.push({ ask: "How do I write for it?", steps: [[`Reading ${c.name}, content`, "1 section"]], say: firstPara(content.md), build: "answer", sources: ["Content"] });
  const a11y = sec("Accessibility");
  if (a11y) {
    const p = a11y.md.split(/\n\s*\n/).find((x) => x.includes("What Naksha provides")) ?? a11y.md.split(/\n\s*\n/)[0];
    out.push({ ask: "What does it do for accessibility?", steps: [[`Reading ${c.name}, accessibility`, "1 section"]], say: plain(p).replace(/^What Naksha provides\.\s*/, ""), build: "answer", sources: ["Accessibility"] });
  }
  if (c.changed) out.push({ ask: "What changed last?", steps: [[`Reading ${c.name}, change log`, "1 entry"]], say: `Naksha ${c.changed}`, build: "answer", sources: ["Change log"] });
  return out.map((a) => ({ ...a, say: cap(a.say) }));
}
const firstPara = (s: string) => plain(s.split(/\n\s*\n/).find((p) => !p.startsWith("|") && !p.startsWith("```")) ?? "");

/** A markdown file from the repo, split into sections for the page's table of contents. */
export function doc(file: string) {
  const raw = read(file);
  const title = raw.match(/^# (.*)$/m)?.[1] ?? "";
  const body = raw.replace(/^<!--[\s\S]*?-->\s*/m, "").replace(/^# .*\n/m, "");
  const { intro, sections } = splitSections(body);
  return { title, raw, intro, introHtml: md(intro), sections };
}
export const readRepo = read;
