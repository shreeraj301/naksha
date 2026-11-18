import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface SpinnerProps {
  /** 16 inside controls, 24 standalone, 32 for a page that is loading. */
  size?: "sm" | "md" | "lg";
  /** Announce progress when the spinner is the only sign of work. Inside a busy button, leave it out. */
  label?: string;
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

/** A thin ring with a moving arc. Under reduced motion it pulses instead of turning. */
export function Spinner({ size = "md", label, styles }: SpinnerProps) {
  return (
    <svg className={cx("nk-spin", size === "sm" && "nk-spin--sm", size === "lg" && "nk-spin--lg")} viewBox="0 0 24 24" style={layoutStyle(styles)} {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}>
      <circle className="t" cx="12" cy="12" r="10" />
      <circle className="a" cx="12" cy="12" r="10" strokeDasharray="15.7 62.8" />
    </svg>
  );
}
