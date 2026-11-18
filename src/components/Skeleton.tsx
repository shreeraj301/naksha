import type { CSSProperties } from "react";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface SkeletonProps {
  /** A number is px; a string is any CSS length ("60%"). */
  width?: number | string;
  height?: number | string;
  /** `circle` stands in for an avatar. */
  shape?: "rect" | "circle";
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

/**
 * A grey stand-in, the shape of what is loading. Hidden from screen readers: mark the region that is loading
 * with `aria-busy="true"` and say what is happening in words.
 */
export function Skeleton({ width = "100%", height = 12, shape = "rect", styles }: SkeletonProps) {
  const size = (v: number | string) => (typeof v === "number" ? `${v / 16}rem` : v);
  const style: CSSProperties = { width: size(width), height: size(height), ...layoutStyle(styles) };
  return <div aria-hidden="true" className={cx("nk-skel", shape === "circle" && "nk-skel--circle")} style={style} />;
}
