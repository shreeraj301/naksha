import type { ReactNode } from "react";
import { Link as AriaLink } from "react-aria-components";
import { cx } from "../cx";
import { Icon } from "./Icon";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface CardProps {
  /** Where the whole card goes. The card is one link: no buttons or links inside it. */
  href: string;
  title: string;
  /** One or two sentences. */
  children?: ReactNode;
  /** The mono reference above the title: "RD-02 · Fintech". */
  code?: string;
  /** A Tag on the right of the reference: "Start here", "Live". */
  tag?: ReactNode;
  /** The picture, 16:10. */
  media?: ReactNode;
  /** The footer's words, with an arrow: "Read the case study". */
  cta?: string;
  /** Preview only. */
  forceState?: "hover" | "focus";
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

/** A project or an item to open: picture, reference, title, a line or two, and where it leads. */
export function Card({ href, title, children, code, tag, media, cta, forceState, styles }: CardProps) {
  return (
    <AriaLink href={href} style={layoutStyle(styles)} className={cx("nk-card", forceState === "hover" && "is-hover", forceState === "focus" && "is-focus")}>
      {media && <div className="nk-card__media">{media}</div>}
      <div className="nk-card__body">
        {(code || tag) && (
          <div className="nk-card__meta">
            {code && <span className="nk-card__code">{code}</span>}
            {tag}
          </div>
        )}
        <h3 className="nk-card__title">{title}</h3>
        {children && <p className="nk-card__text">{children}</p>}
      </div>
      {cta && (
        <div className="nk-card__foot">
          <span>{cta}</span>
          <Icon name="arrow-right" />
        </div>
      )}
    </AriaLink>
  );
}
