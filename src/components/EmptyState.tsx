import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface EmptyStateProps {
  /** What would be here: "No subscriptions yet". */
  title: string;
  /** How to fill it, in one sentence. */
  children?: ReactNode;
  icon?: IconName;
  /** A quiet mono line above the title, in the drawing-sheet voice: "Nothing drawn here yet". */
  code?: string;
  /** The one thing to do next, usually a primary Button. */
  action?: ReactNode;
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

/** An empty list or page that says what will appear and how to make it appear. */
export function EmptyState({ title, children, icon = "inbox", code, action, styles }: EmptyStateProps) {
  return (
    <div className="nk-empty" style={layoutStyle(styles)}>
      <div className="nk-empty__well">
        <Icon name={icon} />
      </div>
      <div className="nk-empty__copy">
        {code && <span className="nk-empty__code">{code}</span>}
        <div className="title-s">{title}</div>
        {children && <p>{children}</p>}
      </div>
      {action}
    </div>
  );
}
