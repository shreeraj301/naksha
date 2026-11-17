import { forwardRef } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";
import { renderIcon, type IconName } from "./Icon";
import type { ForcedState } from "./Button";

export interface IconButtonProps extends Pick<AriaButtonProps, "onPress" | "type" | "autoFocus" | "aria-describedby" | "aria-expanded" | "aria-haspopup" | "aria-controls" | "aria-pressed"> {
  /** Required: an icon button has no visible text, so this is its name for everyone who cannot see the icon. */
  label: string;
  icon: IconName | React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
  /** Extra class for a slot inside another Naksha component (for example `nk-prompt__send`). Not for restyling. */
  slotClassName?: string;
  /** Preview only. */
  forceState?: ForcedState | ForcedState[];
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = "ghost", size = "md", isDisabled, styles, slotClassName, forceState, type = "button", ...aria },
  ref,
) {
  const forced = ([] as ForcedState[]).concat(forceState ?? []);
  return (
    <AriaButton
      ref={ref}
      type={type}
      aria-label={label}
      isDisabled={isDisabled}
      style={layoutStyle(styles)}
      className={cx(
        "nk-iconbtn",
        `nk-iconbtn--${variant}`,
        size !== "md" && `nk-iconbtn--${size}`,
        slotClassName,
        forced.includes("active") && "is-active",
        (forced.includes("hover") || forced.includes("active")) && "is-hover",
        forced.includes("focus") && "is-focus",
      )}
      {...aria}
    >
      {renderIcon(icon)}
    </AriaButton>
  );
});
