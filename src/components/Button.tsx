import { forwardRef, type ReactNode } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";
import { renderIcon, type IconName } from "./Icon";
import { Spinner } from "./Spinner";

/** Preview-only: show a state at rest so the artifact can draw every state side by side. */
export type ForcedState = "hover" | "active" | "focus";

export interface ButtonProps extends Pick<AriaButtonProps, "onPress" | "type" | "form" | "autoFocus" | "aria-label" | "aria-describedby" | "aria-expanded" | "aria-haspopup" | "aria-controls"> {
  children: ReactNode;
  /** One `primary` per region. `highlight` is for the one thing worth noticing; `danger` for actions that destroy. */
  variant?: "primary" | "secondary" | "ghost" | "highlight" | "danger";
  /** 32, 40 or 48 tall on a mouse; 36, 44 or 52 under touch. */
  size?: "sm" | "md" | "lg";
  /** An icon name ("plus") or a node, before the label. The padding on that side drops 2px so the drawn glyph sits on the padding line. */
  iconStart?: IconName | ReactNode;
  iconEnd?: IconName | ReactNode;
  /** Work in progress: shows a spinner, ignores presses, stays focusable and keeps its colour. React Aria announces the change to screen readers. */
  isPending?: boolean;
  isDisabled?: boolean;
  /** Full width of its container. */
  isBlock?: boolean;
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
  /** Preview only. */
  forceState?: ForcedState | ForcedState[];
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, variant = "secondary", size = "md", iconStart, iconEnd, isPending, isDisabled, isBlock, styles, forceState, onPress, type = "button", ...aria },
  ref,
) {
  const forced = ([] as ForcedState[]).concat(forceState ?? []);
  const start = isPending ? <Spinner size="sm" /> : renderIcon(iconStart);
  const end = renderIcon(iconEnd);
  return (
    <AriaButton
      ref={ref}
      type={type}
      isDisabled={isDisabled}
      isPending={isPending}
      onPress={onPress}
      style={layoutStyle(styles)}
      className={cx(
        "nk-btn",
        `nk-btn--${variant}`,
        size !== "md" && `nk-btn--${size}`,
        Boolean(start) && "nk-btn--lead",
        Boolean(end) && "nk-btn--trail",
        isBlock && "nk-btn--block",
        forced.includes("hover") && "is-hover",
        forced.includes("active") && "is-active",
        forced.includes("focus") && "is-focus",
      )}
      {...aria}
    >
      {start}
      <span>{children}</span>
      {end}
    </AriaButton>
  );
});
