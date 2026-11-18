import { forwardRef, type ReactNode } from "react";
import { ToggleButton as AriaToggleButton } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";
import { renderIcon, type IconName } from "./Icon";
import type { ForcedState } from "./Button";

export interface ToggleButtonProps {
  /** The name of what it turns on: "Sound", "Agent view", "Approved only". It stays the same when pressed; the pressed state says the rest. */
  children?: ReactNode;
  /** An icon before the label, or the whole button with `label`. */
  icon?: IconName | ReactNode;
  /** Required when there is no visible text: the name for everyone who cannot see the icon. */
  label?: string;
  isSelected?: boolean;
  defaultSelected?: boolean;
  onChange?: (isSelected: boolean) => void;
  /** 32, 40 or 48 tall on a mouse; 36, 44 or 52 under touch, like Button. */
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
  /** Preview only. */
  forceState?: ForcedState | ForcedState[];
}

/**
 * One button that stays pressed until it is pressed again: sound on, night mode, a filter.
 * Off it looks like a secondary Button; on it fills with ink. Screen readers hear "pressed" or "not pressed".
 */
export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(
  { children, icon, label, isSelected, defaultSelected, onChange, size = "md", isDisabled, styles, forceState },
  ref,
) {
  const forced = ([] as ForcedState[]).concat(forceState ?? []);
  const iconOnly = children === undefined || children === null;
  const glyph = renderIcon(icon);
  return (
    <AriaToggleButton
      ref={ref}
      isSelected={isSelected}
      defaultSelected={defaultSelected}
      onChange={onChange}
      isDisabled={isDisabled}
      aria-label={iconOnly ? label : undefined}
      style={layoutStyle(styles)}
      className={cx(
        iconOnly ? "nk-iconbtn nk-iconbtn--secondary" : "nk-btn nk-btn--secondary",
        "nk-toggle",
        size !== "md" && (iconOnly ? `nk-iconbtn--${size}` : `nk-btn--${size}`),
        !iconOnly && Boolean(glyph) && "nk-btn--lead",
        forced.includes("hover") && "is-hover",
        forced.includes("active") && "is-active",
        forced.includes("focus") && "is-focus",
      )}
    >
      {glyph}
      {!iconOnly && <span>{children}</span>}
    </AriaToggleButton>
  );
});
