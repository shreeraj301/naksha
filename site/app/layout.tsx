import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { preload } from "react-dom";
import "../../dist/css/naksha.css";
import "../../dist/css/components.css";
import "./globals.css";
import { TopBar } from "@/components/TopBar";
import { Toasts } from "@/components/Nk";
import { Skip } from "@/components/Skip";
import { VERSION, GITHUB, componentCount } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { FIT_SCRIPT } from "@/lib/fit";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Naksha, a design system for my products", template: "%s · Naksha" },
  // Components are the capitalised names; announce() is a function, not a component.
  description: `Naksha is the design system of Shreeraj Narwade: tokens, ${componentCount()} React components, and docs written so people and AI agents can both build from them.`,
  openGraph: { title: "Naksha", description: "A design system for my products.", type: "website" },
};
export const viewport: Viewport = { themeColor: "#151413" };

/* Tells search engines what the site is: Naksha, a design system, made by one person. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Naksha",
  url: SITE_URL,
  description: "The design system of Shreeraj Narwade.",
  author: { "@type": "Person", name: "Shreeraj Narwade" },
};

/* Sets the saved theme before the first paint. Dark unless the reader picked light. */
const THEME = `try{var t=localStorage.getItem("naksha-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){}`;

export default function Root({ children }: { children: React.ReactNode }) {
  // The page title font: requested with the HTML, so titles can be fitted and shown before React loads.
  preload("/fonts/ArchivoFlex-Variable.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME }} /><script dangerouslySetInnerHTML={{ __html: FIT_SCRIPT }} /></head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <Skip />
        <TopBar />
        <main id="main">{children}</main>
        <footer className="foot">
          <ul>
            <li><Link href="/get-started/">Getting started</Link></li>
            <li><Link href="/changelog/">Changelog</Link></li>
            <li><Link href="/roadmap/">Roadmap</Link></li>
            <li><a href="/llms.txt">llms.txt</a></li>
            <li><a href={GITHUB}>GitHub</a></li>
          </ul>
          <span>Naksha {VERSION}, by Shreeraj Narwade</span>
        </footer>
        <Toasts />
      </body>
    </html>
  );
}
