import { GITHUB } from "./content";
/* Markdown from the repo links relative to its own file. On the site those links point at GitHub, except the pages the site has. */
const SITE: Record<string, string> = { "docs/ROADMAP.md": "/roadmap/", "CHANGELOG.md": "/changelog/" };
export function fixLinks(html: string, fromDir: string) {
  return html.replace(/href="([^"#][^"]*)"/g, (m, href: string) => {
    if (/^(https?:|mailto:|\/)/.test(href)) return m;
    const target = new URL(href, `http://x/${fromDir ? fromDir + "/" : ""}`).pathname.slice(1);
    return `href="${SITE[target] ?? `${GITHUB}/blob/main/${target}`}"`;
  });
}

/** Colour values in table cells get a swatch beside them. */
export const swatches = (html: string) => html.replace(/<td>(#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?)/g, '<td><i class="sw" style="background:$1" aria-hidden="true"></i>$1');
