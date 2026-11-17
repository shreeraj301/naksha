import type { ReactNode } from "react";
import { Link as AriaLink } from "react-aria-components";
import { cx } from "../cx";
import { IconButton } from "./IconButton";

export type Section = "read" | "build" | "pause" | "play" | "sit" | "gather" | "plug";

export interface NavItem {
  label: string;
  /** The mono line under the label: "Work", "Architecture". */
  sub?: string;
  href: string;
  /** The section colour of its square. */
  section: Section;
  isCurrent?: boolean;
}

export interface TopNavProps {
  name: string;
  /** The line under the name: "Product Designer / Design Engineer". */
  role?: string;
  homeHref?: string;
  items?: NavItem[];
  /** Controls on the right, such as the Human / Agent SegmentedControl. */
  trailing?: ReactNode;
  /** The phone version: name and a menu button. */
  isCompact?: boolean;
  onMenu?: () => void;
  isMenuOpen?: boolean;
  /** Preview only: the item label to draw hovered. */
  forceHover?: string;
}

/** The site's top bar: identity on the left, sections with their colour squares, and room for a control on the right. */
export function TopNav({ name, role, homeHref = "/", items = [], trailing, isCompact, onMenu, isMenuOpen, forceHover }: TopNavProps) {
  return (
    <header className={cx("nk-nav", isCompact && "nk-nav--compact")}>
      <AriaLink className="nk-nav__id" href={homeHref}>
        <span className="nk-nav__name">{name}</span>
        {role && <span className="nk-nav__role">{role}</span>}
      </AriaLink>
      {isCompact ? (
        <IconButton label="Open menu" icon="menu" variant="ghost" aria-expanded={Boolean(isMenuOpen)} onPress={onMenu} />
      ) : (
        <>
          <nav className="nk-nav__items" aria-label="Sections">
            {items.map((it) => (
              <AriaLink
                key={it.label}
                href={it.href}
                className={cx("nk-navitem", forceHover === it.label && "is-hover")}
                aria-current={it.isCurrent ? "page" : undefined}
                style={{ ["--sw" as string]: `var(--section-${it.section})` }}
              >
                <i />
                <b>{it.label}</b>
                {it.sub && <small>{it.sub}</small>}
              </AriaLink>
            ))}
          </nav>
          {trailing}
        </>
      )}
    </header>
  );
}
