import { Label, ProgressBar as AriaProgressBar } from "react-aria-components";
import { cx } from "../cx";

export interface ProgressBarProps {
  /** What is in progress: "Reading the paper". Shown above the bar unless `isCompact`. */
  label: string;
  /** 0 to 100. Leave out with `isIndeterminate`. */
  value?: number;
  /** Work with no known end: the bar slides (and pulses under reduced motion). */
  isIndeterminate?: boolean;
  /** Just the bar, for tight spaces. The label is still read by screen readers. */
  isCompact?: boolean;
}

/** How far along a task is. React Aria's ProgressBar: a `progressbar` with its value, read as a percentage. */
export function ProgressBar({ label, value = 0, isIndeterminate, isCompact }: ProgressBarProps) {
  return (
    <AriaProgressBar
      value={value}
      isIndeterminate={isIndeterminate}
      aria-label={isCompact ? label : undefined}
      className={cx("nk-progress", isIndeterminate && "nk-progress--indeterminate")}
    >
      {({ percentage, valueText }) => (
        <>
          {!isCompact && (
            <div className="nk-progress__head">
              <Label>{label}</Label>
              {!isIndeterminate && <span className="nk-num">{valueText}</span>}
            </div>
          )}
          <div className="nk-progress__track">
            <div className="nk-progress__bar" style={isIndeterminate ? undefined : { width: `${percentage}%` }} />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
