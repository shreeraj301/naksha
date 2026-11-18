"use client";
import { useEffect, useRef } from "react";

/* NAKSHA breathes along Archivo's width axis. A width budget is poured into the letters nearest the pointer
   (or a slow wave when the pointer rests), so one letter swells while the others give way, and a small
   controller keeps the word on its measure. Under reduced motion it stays still. */
export function Giant({ word = "NAKSHA" }: { word?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const h = ref.current!; const L = Array.from(h.querySelectorAll<HTMLElement>("i")); const n = L.length;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const BASE = n * 24; let budget = BASE, cw = 0, px: number | null = null, moved = -1e9, raf = 0, dead = false;
    const set = (i: number, w: number) => { L[i].style.fontVariationSettings = `"wdth" ${w.toFixed(1)}, "wght" 820`; };
    const targets = (p: number) => {
      const f = L.map((_, i) => { const d = (i + 0.5) / n - p; return Math.exp((-d * d) / 0.012); });
      const out = L.map(() => 0), open = L.map(() => true); let left = budget;
      for (let pass = 0; pass < 4 && left > 0.01; pass++) {
        let sum = 0; f.forEach((x, i) => { if (open[i]) sum += x; }); if (!sum) break;
        const give = left; left = 0;
        f.forEach((x, i) => { if (!open[i]) return; out[i] += (give * x) / sum; if (out[i] > 63) { left += out[i] - 63; out[i] = 63; open[i] = false; } });
      }
      return out.map((x) => 62 + x);
    };
    let cur = targets(0.5);
    const paint = (t: number[]) => t.forEach((w, i) => set(i, w));
    const fit = () => {
      budget = BASE; cur = targets(0.5); paint(cur); h.style.fontSize = "20vw";
      const ps = getComputedStyle(h.parentElement!); cw = h.parentElement!.clientWidth - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight);
      h.style.fontSize = `${(parseFloat(getComputedStyle(h).fontSize) * cw) / h.getBoundingClientRect().width * 0.985}px`;
      h.style.visibility = "visible";
    };
    const frame = (t: number) => {
      if (dead) return;
      const p = px !== null && t - moved < 2400 ? px : 0.5 + 0.62 * Math.sin((t / 1000) * 0.55);
      const tg = targets(p); cur = cur.map((c, i) => c + (tg[i] - c) * 0.08); paint(cur);
      const err = (cw * 0.985 - h.getBoundingClientRect().width) / cw;
      budget = Math.max(n * 4, Math.min(n * 56, budget + err * n * 30));
      raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => { if (e.pointerType !== "mouse") return; const r = h.getBoundingClientRect(); px = (e.clientX - r.left) / r.width; moved = performance.now(); };
    const host = h.closest(".hero") as HTMLElement;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !reduce && !raf) raf = requestAnimationFrame(frame); else if (!visible) { cancelAnimationFrame(raf); raf = 0; } });
    document.fonts.ready.then(() => { if (dead) return; fit(); io.observe(h); });
    addEventListener("resize", fit); host?.addEventListener("pointermove", onMove);
    return () => { dead = true; cancelAnimationFrame(raf); io.disconnect(); removeEventListener("resize", fit); host?.removeEventListener("pointermove", onMove); };
  }, []);
  return (
    <h1 ref={ref} className="giant" aria-label="Naksha" style={{ visibility: "hidden" }}>
      {word.split("").map((ch, i) => <i key={i} aria-hidden="true">{ch}</i>)}
    </h1>
  );
}
