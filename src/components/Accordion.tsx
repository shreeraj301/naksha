import type { ReactNode } from "react";
import { Button as AriaButton, Disclosure, DisclosureGroup, DisclosurePanel, Heading } from "react-aria-components";
import { cx } from "../cx";
import { Icon } from "./Icon";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface AccordionItem {
  id: string;
  /** The question or the section's name. */
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Ids open at first. */
  defaultExpanded?: string[];
  /** Let several stay open. Off: opening one closes the others. */
  allowsMultipleExpanded?: boolean;
  /** Heading level of each title, to fit the page's outline. */
  headingLevel?: 2 | 3 | 4;
  /** Preview only: the item id to draw in each state, e.g. `{ hover: …, focus: … }`. */
  forceState?: { hover?: string; focus?: string };
  /** @deprecated Use `forceState={{ hover }}`. Removed in 0.6.0. */
  forceHover?: string;
  /** @deprecated Use `forceState={{ focus }}`. Removed in 0.6.0. */
  forceFocus?: string;
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

/** Numbered sections that open in place: an FAQ, or the details under a summary. */
export function Accordion({ items, defaultExpanded, allowsMultipleExpanded, headingLevel = 3, forceState, forceHover: legacyHover, forceFocus: legacyFocus, styles }: AccordionProps) {
  const forceHover = forceState?.hover ?? legacyHover;
  const forceFocus = forceState?.focus ?? legacyFocus;
  return (
    <DisclosureGroup className="nk-acc" style={layoutStyle(styles)} defaultExpandedKeys={defaultExpanded} allowsMultipleExpanded={allowsMultipleExpanded}>
      {items.map((item, i) => (
        <Disclosure key={item.id} id={item.id} className={({ isExpanded }) => cx("nk-acc__item", isExpanded && "is-open")}>
          <Heading level={headingLevel} className="nk-acc__heading">
            <AriaButton slot="trigger" className={cx("nk-acc__head", forceHover === item.id && "is-hover", forceFocus === item.id && "is-focus")}>
              <span className="nk-acc__idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="nk-acc__title">{item.title}</span>
              <Icon name="plus" />
            </AriaButton>
          </Heading>
          {/* The padding lives inside: a closed panel stays findable with the browser's find, and must take no space. */}
          <DisclosurePanel className="nk-acc__panelwrap">
            <div className="nk-acc__panel">{item.content}</div>
          </DisclosurePanel>
        </Disclosure>
      ))}
    </DisclosureGroup>
  );
}
