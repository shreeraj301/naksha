// Every page of the static export in site/out, plus one address that does not exist, so the 404 page is checked too.
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const OUT = resolve("site/out");

function walk(dir: string, base: string, acc: string[]) {
  if (existsSync(join(dir, "index.html"))) acc.push(base);
  for (const d of readdirSync(dir)) {
    if (d.startsWith("_") || d === "404") continue; // Next's own copies of the 404 page
    const full = join(dir, d);
    if (statSync(full).isDirectory()) walk(full, `${base}${d}/`, acc);
  }
}

export function pages(): string[] {
  if (!existsSync(join(OUT, "index.html"))) throw new Error("site/out is missing: run `cd site && npm run build` first");
  const acc: string[] = [];
  walk(OUT, "/", acc);
  return [...acc.sort(), "/no-such-page/"];
}

/** Short, stable label for a file name or a known-issues key: "/" is "home", "/components/button/" is "components-button". */
export function slug(path: string): string {
  return path.replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home";
}
