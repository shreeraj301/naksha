import type { ReactNode } from "react";
import { Switch as AriaSwitch } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface SwitchProps {
  /** Name the setting, not the action: "Agent view", not "Turn on agent view". */
  children: ReactNode;
  isSelected?: boolean;
  defaultSelected?: boolean;
  onChange?: (isSelected: boolean) => void;
  isDisabled?: boolean;
  name?: string;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
  /** Preview only. */
  forceState?: "hover" | "focus";
}

/** A setting that applies the moment it flips. If the change waits for a Save button, use Checkbox. */
export function Switch({ children, styles, forceState, ...rest }: SwitchProps) {
  return (
    <AriaSwitch {...rest} style={layoutStyle(styles)} className={cx("nk-switch", forceState === "hover" && "is-hover", forceState === "focus" && "is-focus")}>
      <span className="nk-switch__track" />
      <span>{children}</span>
    </AriaSwitch>
  );
}
