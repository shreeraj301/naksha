import type { CSSProperties } from "react";

/**
 * The only style overrides a Naksha component accepts: where it sits, never how it looks.
 * Colour, type, borders and inner padding stay owned by the system (ADR 0009).
 */
export const LAYOUT_PROPERTIES = [
  "margin", "marginBlock", "marginBlockStart", "marginBlockEnd", "marginInline", "marginInlineStart", "marginInlineEnd",
  "marginTop", "marginRight", "marginBottom", "marginLeft",
  "width", "minWidth", "maxWidth", "inlineSize", "minInlineSize", "maxInlineSize",
  "flex", "flexGrow", "flexShrink", "flexBasis", "alignSelf", "justifySelf", "placeSelf", "order",
  "gridArea", "gridColumn", "gridColumnStart", "gridColumnEnd", "gridRow", "gridRowStart", "gridRowEnd",
  "position", "inset", "insetBlock", "insetInline", "top", "right", "bottom", "left", "zIndex", "visibility",
] as const;

export type LayoutProperty = (typeof LAYOUT_PROPERTIES)[number];
export type LayoutStyles = Partial<Pick<CSSProperties, LayoutProperty>>;

const allowed = new Set<string>(LAYOUT_PROPERTIES);

/** Keep only layout properties. Anything else is dropped, with a warning outside production. */
export function layoutStyle(styles: LayoutStyles | undefined): CSSProperties | undefined {
  if (!styles) return undefined;
  const out: Record<string, unknown> = {};
  const dropped: string[] = [];
  for (const [key, value] of Object.entries(styles)) {
    if (allowed.has(key)) out[key] = value;
    else dropped.push(key);
  }
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.NODE_ENV;
  if (dropped.length && env !== "production") {
    console.warn(`Naksha: "styles" accepts layout only. Ignored: ${dropped.join(", ")}.`);
  }
  return out as CSSProperties;
}
