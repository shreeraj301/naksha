import type { ReactNode } from "react";
import { Link as AriaLink, Button as AriaButton } from "react-aria-components";
import { cx } from "../cx";
import { Icon, type IconName } from "./Icon";
import { IconButton } from "./IconButton";

export type AlertTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface AlertProps {
  tone?: AlertTone;
  /** What happened, in a few words: "Renews in 3 days". */
  title: string;
  /** What it means or what to do, in one or two sentences. */
  children?: ReactNode;
  /** One next step, as a link: `{ label, href }` or `{ label, onPress }`. */
  action?: { label: string; href?: string; onPress?: () => void };
  /** Shows a Dismiss button. */
  onDismiss?: () => void;
}

const ICON: Record<AlertTone, IconName> = { neutral: "info", info: "info", success: "circle-check", warning: "triangle-alert", danger: "circle-alert" };

/**
 * A message on the page about the page: saved state, a renewal, a file that would not read. It stays until
 * dismissed. Danger alerts interrupt screen readers (`role="alert"`); the rest wait their turn (`role="status"`).
 */
export function Alert({ tone = "neutral", title, children, action, onDismiss }: AlertProps) {
  return (
    <div className={cx("nk-alert", `nk-alert--${tone}`)} role={tone === "danger" ? "alert" : "status"}>
      <Icon name={ICON[tone]} />
      <div className="nk-alert__body">
        <div className="nk-alert__title">{title}</div>
        {children && <div className="nk-alert__text">{children}</div>}
        {action && (
          <div className="nk-alert__actions">
            {action.href ? (
              <AriaLink className="nk-link" href={action.href}>
                {action.label}
              </AriaLink>
            ) : (
              <AriaButton className="nk-link" onPress={action.onPress}>
                {action.label}
              </AriaButton>
            )}
          </div>
        )}
      </div>
      {onDismiss && <IconButton label="Dismiss" icon="x" size="sm" variant="ghost" onPress={onDismiss} />}
    </div>
  );
}
