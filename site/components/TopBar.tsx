"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Naksha from "naksha";
import { useEffect, useState } from "react";

const N = Naksha as unknown as Record<string, any>;
export const NAV = [
  { href: "/get-started/", label: "Get started" },
  { href: "/foundations/", label: "Foundations" },
  { href: "/components/", label: "Components" },
  { href: "/ai/", label: "AI" },
  { href: "/brand/", label: "Brand book" },
  { href: "/changelog/", label: "Changelog" },
];

export function TopBar() {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<string>("dark");
  useEffect(() => { setTheme(document.documentElement.dataset.theme || "dark"); }, []);
  useEffect(() => { setOpen(false); }, [path]);
  const pick = (t: string) => { setTheme(t); document.documentElement.dataset.theme = t; try { localStorage.setItem("naksha-theme", t); } catch {} };
  const cur = (href: string) => (path.startsWith(href) ? "page" : undefined);
  return (
    <header className="top">
      <Link className="mark" href="/">Naksha</Link>
      <nav className="navlinks" aria-label="Main">
        {NAV.map((n) => <Link key={n.href} href={n.href} aria-current={cur(n.href)}>{n.label}</Link>)}
      </nav>
      <div className="right">
        <N.SegmentedControl label="Theme" variant="quiet" value={theme} onChange={pick} options={[{ id: "dark", label: "Dark" }, { id: "light", label: "Light" }]} />
        <button className="menu" type="button" aria-expanded={open} aria-controls="m-nav" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
      </div>
      <nav id="m-nav" className="mnav" aria-label="Main" hidden={!open}>
        {NAV.map((n) => <Link key={n.href} href={n.href} aria-current={cur(n.href)}>{n.label}</Link>)}
        <Link href="/roadmap/" aria-current={cur("/roadmap/")}>Roadmap</Link>
      </nav>
    </header>
  );
}

export function CopyMarkdown({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return <N.Button variant="secondary" size="sm" iconStart={done ? "check" : "copy"} onPress={() => { navigator.clipboard?.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1600); }, () => {}); }}>{done ? "Copied" : "Copy as Markdown"}</N.Button>;
}
