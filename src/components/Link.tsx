import type { ReactNode } from "react";
import { Link as AriaLink } from "react-aria-components";
import { cx } from "../cx";
import { renderIcon, type IconName } from "./Icon";

export interface LinkProps {
  children: ReactNode;
  href?: string;
  /** For a link that runs code instead of going somewhere. Prefer a Button for actions. */
  onPress?: () => void;
  /** Opens elsewhere: sets target and rel for you. */
  isExternal?: boolean;
  /** `muted` for secondary links in running text. */
  variant?: "default" | "muted";
  /** An icon after the text, usually "arrow-right" for a standalone link that leads on. */
  iconEnd?: IconName;
  isDisabled?: boolean;
  /** Preview only. */
  forceState?: "hover" | "focus";
}

/** Goes somewhere. Underlined so it reads as a link without colour. */
export function Link({ children, href, onPress, isExternal, variant = "default", iconEnd, isDisabled, forceState }: LinkProps) {
  return (
    <AriaLink
      href={href}
      onPress={onPress}
      isDisabled={isDisabled}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={cx("nk-link", variant === "muted" && "nk-link--muted", forceState === "hover" && "is-hover", forceState === "focus" && "is-focus")}
    >
      {children}
      {iconEnd && !isDisabled ? <> {renderIcon(iconEnd)}</> : null}
    </AriaLink>
  );
}
