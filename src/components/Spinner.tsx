import { cx } from "../cx";

export interface SpinnerProps {
  /** 16 inside controls, 24 standalone, 32 for a page that is loading. */
  size?: "sm" | "md" | "lg";
  /** Announce progress when the spinner is the only sign of work. Inside a busy button, leave it out. */
  label?: string;
}

/** A thin ring with a moving arc. Under reduced motion it pulses instead of turning. */
export function Spinner({ size = "md", label }: SpinnerProps) {
  return (
    <svg className={cx("nk-spin", size === "sm" && "nk-spin--sm", size === "lg" && "nk-spin--lg")} viewBox="0 0 24 24" {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}>
      <circle className="t" cx="12" cy="12" r="10" />
      <circle className="a" cx="12" cy="12" r="10" strokeDasharray="15.7 62.8" />
    </svg>
  );
}
