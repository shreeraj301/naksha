"use client";
import * as Naksha from "naksha";
import { createElement, useEffect, useRef, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

/* Naksha components described as data: {"$c": "Button", "p": {...}}. The README previews and the home page use the same shape.
   "$noop" becomes an empty handler, "$html" a block of markup, a nested {"$c"} an element, "$name" a handler from `handlers`. */
export type Spec = { $c: string; p?: Record<string, unknown> };
type Handlers = Record<string, (...a: any[]) => void>;
const N = Naksha as unknown as Record<string, any>;

function val(v: unknown, h: Handlers): unknown {
  if (v === "$noop") return () => {};
  if (typeof v === "string" && v[0] === "$" && h[v.slice(1)]) return h[v.slice(1)];
  if (Array.isArray(v)) return v.map((x, i) => (isSpec(x) ? el(x, h, i) : val(x, h)));
  if (v && typeof v === "object") {
    if (isSpec(v)) return el(v, h);
    const o = v as Record<string, unknown>;
    if (typeof o.$html === "string") return createElement("div", { style: { height: "100%" }, dangerouslySetInnerHTML: { __html: o.$html } });
    const out: Record<string, unknown> = {};
    for (const k in o) out[k] = val(o[k], h);
    return out;
  }
  return v;
}
const isSpec = (v: unknown): v is Spec => !!v && typeof v === "object" && typeof (v as Spec).$c === "string";
export function el(s: Spec, h: Handlers = {}, key?: number): ReactNode {
  const props: Record<string, unknown> = { key };
  for (const k in s.p || {}) props[k] = val(s.p![k], h);
  const C = N[s.$c];
  return C ? createElement(C, props) : null;
}
export function Nk({ spec, handlers }: { spec: Spec; handlers?: Handlers }) {
  return <>{el(spec, handlers)}</>;
}

/** A README preview: static markup from artifact/components/<Name>/preview.html with live components mounted into its [data-nk] spans. */
export function LivePreview({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const roots: Root[] = [];
    ref.current?.querySelectorAll<HTMLElement>("[data-nk]").forEach((n) => {
      const r = createRoot(n);
      r.render(el(JSON.parse(n.getAttribute("data-nk")!)));
      roots.push(r);
    });
    return () => { const rs = roots.splice(0); setTimeout(() => rs.forEach((r) => r.unmount())); };
  }, [html]);
  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Toasts() {
  return createElement(N.Toaster);
}
