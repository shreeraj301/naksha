/* After the export: preload the text font every page uses, so text is drawn once, in its own font, instead of
   in a fallback that reflows when the font arrives. Next names the files with a hash, so this runs on the built HTML. */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "../out");
const media = readdirSync(path.join(out, "_next/static/media"));
const want = ["Archivo-Variable."].map((p) => media.find((f) => f.startsWith(p) && f.endsWith(".woff2")));
if (want.some((f) => !f)) throw new Error(`preload-fonts: missing a font in _next/static/media (${media.join(", ")})`);
const links = want.map((f) => `<link rel="preload" href="/_next/static/media/${f}" as="font" type="font/woff2" crossorigin="anonymous"/>`).join("");

let n = 0;
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) walk(file);
    else if (name.endsWith(".html")) {
      const html = readFileSync(file, "utf8");
      if (html.includes(links)) continue;
      writeFileSync(file, html.replace("<head>", `<head>${links}`));
      n++;
    }
  }
};
walk(out);
console.log(`preload-fonts: ${want.join(", ")} in ${n} pages`);
