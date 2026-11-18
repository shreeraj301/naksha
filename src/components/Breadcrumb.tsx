import { Breadcrumb as AriaBreadcrumb, Breadcrumbs, Link as AriaLink } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  /** From the top level down. The last one is the current page and is not a link. */
  items: Crumb[];
  /** Names the trail when a page has more than one. */
  label?: string;
  /** Preview only: the crumb index to draw in each state, e.g. `{ hover: … }`. */
  forceState?: { hover?: number };
  /** @deprecated Use `forceState={{ hover }}`. Removed in 0.6.0. */
  forceHover?: number;
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

/** Where this page sits. Mono caps separated by slashes, like a drawing's sheet reference. */
export function Breadcrumb({ items, label = "Breadcrumb", forceState, forceHover: legacyHover, styles }: BreadcrumbProps) {
  const forceHover = forceState?.hover ?? legacyHover;
  return (
    <nav aria-label={label} style={layoutStyle(styles)}>
      <Breadcrumbs className="nk-crumb">
        {items.map((c, i) => (
          <AriaBreadcrumb key={i}>
            <AriaLink href={i === items.length - 1 ? undefined : c.href} className={cx(forceHover === i && "is-hover")}>
              {c.label}
            </AriaLink>
          </AriaBreadcrumb>
        ))}
      </Breadcrumbs>
    </nav>
  );
}
