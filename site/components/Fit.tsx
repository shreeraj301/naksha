"use client";
import { useEffect, useRef } from "react";

/* A component name fills the page measure: its width axis is solved to the container, and the font size takes over
   at either end (very short names grow, very long ones shrink). */
export function Fit({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current!; const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const w = (x: number) => { el.style.fontVariationSettings = `"wdth" ${x}, "wght" 800`; return el.getBoundingClientRect().width; };
    const solve = () => {
      el.classList.remove("go"); el.style.fontSize = "";
      const cw = el.parentElement!.clientWidth, fs = parseFloat(getComputedStyle(el).fontSize);
      if (w(62) > cw) { el.style.fontSize = `${(fs * cw) / w(62)}px`; return 62; }
      if (w(125) < cw) { el.style.fontSize = `${Math.min((fs * cw) / w(125), innerHeight * 0.4)}px`; return 125; }
      let lo = 62, hi = 125; for (let k = 0; k < 14; k++) { const m = (lo + hi) / 2; if (w(m) > cw) hi = m; else lo = m; } return lo;
    };
    let t = 62;
    document.fonts.ready.then(() => {
      t = solve(); el.style.visibility = "visible";
      if (reduce) { w(t); return; }
      w(62); el.getBoundingClientRect(); el.classList.add("go"); requestAnimationFrame(() => w(t));
    });
    const onResize = () => w(solve());
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  }, [text]);
  return <div className="fitwrap"><h1 ref={ref} className="fit" style={{ visibility: "hidden" }}>{text}</h1></div>;
}
