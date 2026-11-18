"use client";
import { useEffect, useState } from "react";

/* The page's contents. On a wide screen it stays beside the text and marks the section being read; on a phone it is
   a closed list at the top of the page. Both are plain links, so they work before scripts load. */
export function Toc({ sections }: { sections: { id: string; title: string }[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const heads = sections.map((s) => document.getElementById(s.id)).filter((h): h is HTMLElement => !!h);
    // The section being read is the last heading that has passed a line a third of the way down the screen.
    const pick = () => {
      const line = innerHeight / 3;
      let id: string | null = null;
      for (const h of heads) if (h.getBoundingClientRect().top <= line) id = h.id;
      setCurrent(id ?? heads[0]?.id ?? null);
    };
    pick();
    addEventListener("scroll", pick, { passive: true });
    addEventListener("resize", pick);
    return () => { removeEventListener("scroll", pick); removeEventListener("resize", pick); };
  }, [sections]);
  const links = sections.map((s) => (
    <a key={s.id} href={`#${s.id}`} aria-current={current === s.id ? "location" : undefined}>{s.title}</a>
  ));
  return (
    <>
      <nav className="toc" aria-label="On this page"><b>On this page</b>{links}</nav>
      <details className="toc-phone">
        <summary>On this page</summary>
        <nav aria-label="On this page, list">{sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}</nav>
      </details>
    </>
  );
}
