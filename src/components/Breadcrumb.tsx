import { Breadcrumb as AriaBreadcrumb, Breadcrumbs, Link as AriaLink } from "react-aria-components";
import { cx } from "../cx";

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  /** From the top level down. The last one is the current page and is not a link. */
  items: Crumb[];
  /** Names the trail when a page has more than one. */
  label?: string;
  /** Preview only: the index of the crumb to draw hovered. */
  forceHover?: number;
}

/** Where this page sits. Mono caps separated by slashes, like a drawing's sheet reference. */
export function Breadcrumb({ items, label = "Breadcrumb", forceHover }: BreadcrumbProps) {
  return (
    <nav aria-label={label}>
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
