import type { ReactNode } from "react";
import { Link as AriaLink } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface ListProps {
  /** ListItems. */
  children: ReactNode;
  /** A name for the list when no heading right above it says what it holds. */
  label?: string;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
}

/** Rows between hairline rules, like Accordion. Holds ListItems only. */
export function List({ children, label, styles }: ListProps) {
  return (
    <ul className="nk-list" aria-label={label} style={layoutStyle(styles)}>
      {children}
    </ul>
  );
}

export interface ListItemProps {
  /** What the row is: "Netflix", "Kitchen tiles", "Invoice 0142". */
  title: ReactNode;
  /** A small picture on the left: an Avatar, or an Image with `alt=""`. It is hidden from screen readers, because the title already names the row. */
  media?: ReactNode;
  /** One short line under the title: price, phase, date. */
  meta?: ReactNode;
  /** A sentence or two: why it is here, what changed. */
  description?: ReactNode;
  /** On the right, beside the title: an amount or a Tag. */
  trailing?: ReactNode;
  /** Buttons for this row, under the text. They are never inside the link. */
  actions?: ReactNode;
  /** Makes the picture, the text and the trailing part one link. Actions stay separate buttons beside it. */
  href?: string;
  /** Preview only. */
  forceState?: "hover" | "focus";
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

/**
 * One row of a List: a picture, a title with a line under it, a sentence, something on the right, and actions.
 * With `href` the row's content is one link; its actions sit outside that link, so nothing is nested.
 */
export function ListItem({ title, media, meta, description, trailing, actions, href, forceState, styles }: ListItemProps) {
  const content = (
    <>
      {media && (
        <span className="nk-listitem__media" aria-hidden="true">
          {media}
        </span>
      )}
      <span className="nk-listitem__body">
        <span className="nk-listitem__title">{title}</span>
        {meta && <span className="nk-listitem__meta">{meta}</span>}
        {description && <span className="nk-listitem__text">{description}</span>}
      </span>
      {trailing && <span className="nk-listitem__trailing">{trailing}</span>}
    </>
  );
  return (
    <li className={cx("nk-listitem", !media && "nk-listitem--bare")} style={layoutStyle(styles)}>
      {href ? (
        <AriaLink
          href={href}
          className={cx("nk-listitem__main nk-listitem__main--link", forceState === "hover" && "is-hover", forceState === "focus" && "is-focus")}
        >
          {content}
        </AriaLink>
      ) : (
        <div className="nk-listitem__main">{content}</div>
      )}
      {actions && <div className="nk-listitem__actions">{actions}</div>}
    </li>
  );
}
