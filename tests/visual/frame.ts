// Renders an artifact preview the way the Claude artifact frame does: tokens.css, bundle.css,
// React 18.3.1, bundle.js preloaded, data-theme on <html>. Reads only dist/artifact.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

export const ART = resolve("dist/artifact");
export const OUT = resolve("dist/visual");

export function previews(): { name: string; width: number; height: number }[] {
  const dir = join(ART, "components");
  return readdirSync(dir)
    .filter((d) => existsSync(join(dir, d, "preview.html")))
    .map((name) => {
      const first = readFileSync(join(dir, name, "preview.html"), "utf8").split("\n")[0] ?? "";
      const w = /width=(\d+)/.exec(first);
      const h = /height=(\d+)/.exec(first);
      return { name, width: w ? Number(w[1]) : 960, height: h ? Number(h[1]) : 120 };
    });
}

export function framed(name: string, theme: "light" | "dark"): string {
  const src = readFileSync(join(ART, "components", name, "preview.html"), "utf8");
  const u = (p: string) => `file://${join(ART, p)}`;
  const preload = [
    `<link rel="stylesheet" href="${u("tokens.css")}">`,
    `<link rel="stylesheet" href="${u("components/bundle.css")}">`,
    `<script src="${u("components/lib/react.production.min.js")}"></script>`,
    `<script src="${u("components/lib/react-dom.production.min.js")}"></script>`,
    `<script src="${u("components/bundle.js")}"></script>`,
  ].join("");
  let html = src.includes("<head>") ? src.replace("<head>", `<head>${preload}`) : preload + src;
  html = html.replace(/<html([^>]*)>/, (_m, attrs: string) => `<html${attrs.replace(/\sdata-theme="[^"]*"/, "")} data-theme="${theme}">`);
  mkdirSync(OUT, { recursive: true });
  const file = join(OUT, `${name}-${theme}.html`);
  writeFileSync(file, html);
  return `file://${file}`;
}
