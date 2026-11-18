import type { ReactNode } from "react";
import { Radio, RadioGroup } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface SegmentedOption {
  id: string;
  /** One or two words. Segments are mono uppercase, so long labels crowd the control. */
  label: ReactNode;
}

export interface SegmentedControlProps {
  /** Required: names the group for screen readers ("View", "Reading level"). */
  label: string;
  /** Two to four options that switch a view in place. For an answer in a form, use RadioGroup. */
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** No frame, for a toolbar that already has one. */
  variant?: "default" | "quiet";
  isDisabled?: boolean;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
  /** Preview only: the option id to draw in each state, e.g. `{ hover: … }`. */
  forceState?: { hover?: string };
  /** @deprecated Use `forceState={{ hover }}`. Removed in 0.6.0. */
  forceHover?: string;
}

/**
 * A row of options where exactly one is on, and the choice applies at once. Built on React Aria's RadioGroup, so it
 * is a real radio group: one Tab stop on the chosen option, and arrow keys move the choice.
 */
export function SegmentedControl({ label, options, value, defaultValue, onChange, variant = "default", isDisabled, styles, forceState, forceHover: legacyHover }: SegmentedControlProps) {
  const forceHover = forceState?.hover ?? legacyHover;
  return (
    <RadioGroup
      aria-label={label}
      orientation="horizontal"
      value={value}
      defaultValue={value === undefined ? (defaultValue ?? options[0]?.id) : undefined}
      onChange={(v) => onChange?.(v)}
      isDisabled={isDisabled}
      style={layoutStyle(styles)}
      className={cx("nk-seg", variant === "quiet" && "nk-seg--quiet")}
    >
      {options.map((o) => (
        <Radio key={o.id} value={o.id} className={cx("nk-seg__opt", forceHover === o.id && "is-hover")}>
          {o.label}
        </Radio>
      ))}
    </RadioGroup>
  );
}
