import { components } from "./content";
import { GROUP_ORDER, hueVar } from "./groups";
import live from "./live.json";
import type { Item, Band } from "@/components/Index";
import type { Spec } from "@/components/Nk";

const L = live as Record<string, Spec>;
export function indexData(): { items: Item[]; bands: Band[] } {
  const cs = components();
  const items = cs.map((c) => ({ name: c.name, slug: c.slug, group: c.group, hue: hueVar(c.group), summary: c.summary, spec: L[c.name] ?? null }));
  const bands = GROUP_ORDER.map((g) => { const m = cs.filter((c) => c.group === g); return { name: g, hue: hueVar(g), count: m.length, spec: L[m[0]?.name] ?? null }; });
  return { items, bands };
}
