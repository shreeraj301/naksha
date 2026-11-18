"use client";
import { useEffect, useRef } from "react";
import metrics from "@/lib/flex-metrics.json";

/* A component name fills the page measure: its width axis is solved to the container, and the font size takes over
   at either end (very short names grow, very long ones shrink).

   The fitting runs from a small script in the page head (FIT_SCRIPT in lib/fit.ts, loaded by the layout), called right after the
   title in the HTML. So the title is fitted and shown as soon as its font arrives, not after React loads, which on a
   slow phone was seven seconds later and moved the page below it. React only refits on resize. */

/* The title's width per px of font size at both ends of the width axis, from the font's own advance widths
   (letter-spacing -0.015em included). Kerning is left out, so it is within about 1.5% of what the browser draws. */
const M = metrics as unknown as Record<"62" | "125", Record<string, number>>;
const ratio = (text: string, w: "62" | "125") => [...text.toUpperCase()].reduce((sum, ch) => sum + (M[w][ch] ?? 0.6) - 0.015, 0);

/* The same choice the script makes, in CSS: long names shrink at the narrowest width, short ones grow at the widest
   (up to 40% of the screen height), and the rest keep 16vw. So the band is its final height at first paint. */
export function fitSize(text: string) {
  const r62 = ratio(text, "62").toFixed(3), r125 = ratio(text, "125").toFixed(3);
  return `max(min(16vw, calc(100cqw / ${r62})), min(calc(100cqw / ${r125}), 40vh))`;
}

export function Fit({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    const el = ref.current!;
    const nkFit = (window as unknown as { nkFit?: (el: HTMLElement, again?: boolean) => void }).nkFit;
    if (!nkFit) return;
    // The inline call fitted the title the server sent. A title rendered by client navigation, or a new text in
    // the same heading, has no inline call after it: fit it here.
    if (!first.current || !("fitted" in el.dataset)) nkFit(el);
    first.current = false;
    const onResize = () => nkFit(el, true);
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  }, [text]);
  return (
    <div className="fitwrap">
      <h1 ref={ref} className="fit" style={{ visibility: "hidden", fontSize: fitSize(text) }} suppressHydrationWarning>{text}</h1>
      <script dangerouslySetInnerHTML={{ __html: "nkFit(document.currentScript.previousElementSibling)" }} />
    </div>
  );
}
