import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "../../dist/css/naksha.css";
import "../../dist/css/components.css";
import "./globals.css";
import { TopBar } from "@/components/TopBar";
import { Toasts } from "@/components/Nk";
import { Skip } from "@/components/Skip";
import { VERSION, GITHUB, componentCount } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://127.0.0.1:4401")),
  title: { default: "Naksha, a design system for my products", template: "%s · Naksha" },
  // Components are the capitalised names; announce() is a function, not a component.
  description: `Tokens, ${componentCount()} React components, and rules an agent can read. The design system of Shreeraj Narwade.`,
  openGraph: { title: "Naksha", description: "A design system for my products.", type: "website" },
};
export const viewport: Viewport = { themeColor: "#151413" };

/* Sets the saved theme before the first paint. Dark unless the reader picked light. */
const THEME = `try{var t=localStorage.getItem("naksha-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){}`;

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME }} /></head>
      <body>
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
