"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Nk, type Spec } from "./Nk";

export interface Item { name: string; slug: string; group: string; hue: string; summary: string; spec: Spec | null }
export interface Band { name: string; hue: string; count: number; spec: Spec | null }

/* The seven groups as colour bands that filter the list, then every component as a name that stretches on its
   width axis when you point at it (or when it crosses the middle of the screen on touch), with its live component beside it. */
export function Index({ items, bands }: { items: Item[]; bands: Band[] }) {
  const [group, setGroup] = useState<string | null>(null);
  const [on, setOn] = useState(0);
  // The previews are decoration (inert, hidden from assistive tech), so they render after hydration only.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const list = useRef<HTMLOListElement>(null);
  const shown = items.map((it, i) => ({ it, i })).filter(({ it }) => !group || it.group === group);

  useEffect(() => {
    if (!matchMedia("(hover: none)").matches) return;
    const rows = Array.from(list.current!.querySelectorAll<HTMLElement>("a[data-i]"));
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setOn(Number((e.target as HTMLElement).dataset.i))), { rootMargin: "-48% 0px -48% 0px" });
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [group]);

  const pick = (g: string) => {
    const next = group === g ? null : g; setGroup(next);
    const first = items.findIndex((it) => !next || it.group === next); setOn(first);
    if (next) document.getElementById("index")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const cur = items[on];

  return (
    <>
      <section className="groups" aria-labelledby="gh">
        <header><h2 id="gh">Seven groups</h2><span>Pick one to filter the list</span></header>
        <div className={`bands${group ? " filtered" : ""}`} role="group" aria-label="Filter components by group">
          {bands.map((b) => (
            <button key={b.name} type="button" style={{ ["--hue" as string]: b.hue }} aria-pressed={group === b.name} onClick={() => pick(b.name)}>
              <small>{b.count} components</small>
              {ready && b.spec && <span className="peek" aria-hidden="true" inert><Nk spec={b.spec} /></span>}
              <b>{b.name}</b><span className="sr">, show only {b.name}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="index" id="index" aria-labelledby="ixh">
        <header>
          <h2 id="ixh">Components</h2>
          <div className="row" style={{ gap: "var(--space-16)" }}>
            <span className="cnt">{group ? `${shown.length} in ${group}` : <><span className="fine-pointer">Point at a name</span><span className="touch">Scroll the list</span></>}</span>
            {group && <button className="all" type="button" onClick={() => { setGroup(null); setOn(0); }}>Show all {items.length}</button>}
          </div>
        </header>
        <ol className="ix" ref={list}>
          {shown.map(({ it, i }) => (
            <li key={it.slug}>
              <Link href={`/components/${it.slug}/`} data-i={i} className={i === on ? "on" : undefined} style={{ ["--hue" as string]: it.hue }}
                onPointerEnter={(e) => { if (e.pointerType === "mouse") setOn(i); }} onFocus={() => setOn(i)}>
                <b>{it.name}</b><small>{it.group}</small>
              </Link>
            </li>
          ))}
        </ol>
        <aside className="pv" aria-hidden="true" inert style={{ ["--hue" as string]: cur?.hue }}>
          <div className="cap"><b><i />{cur?.name}</b><span>Live</span></div>
          <div className="slot">
            {items.map((it, i) => <div key={it.slug} className={i === on ? "on" : undefined}>{ready && it.spec && <Nk spec={it.spec} />}</div>)}
          </div>
          <p>{cur?.summary}</p>
        </aside>
      </section>
    </>
  );
}
