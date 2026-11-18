import type { ReactNode } from "react";
import { Tab, TabList, TabPanel, Tabs as AriaTabs } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface TabItem {
  id: string;
  label: string;
  /** A count after the label, in mono: research notes, open items. */
  count?: number;
  content?: ReactNode;
  isDisabled?: boolean;
}

export interface TabsProps {
  /** Names the tab list: "Case study sections". */
  label: string;
  items: TabItem[];
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (id: string) => void;
  /** Preview only: the tab id to draw in each state, e.g. `{ hover: …, focus: … }`. */
  forceState?: { hover?: string; focus?: string };
  /** @deprecated Use `forceState={{ hover }}`. Removed in 0.6.0. */
  forceHover?: string;
  /** @deprecated Use `forceState={{ focus }}`. Removed in 0.6.0. */
  forceFocus?: string;
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

/** Views of one thing, side by side. Arrow keys move between tabs; Tab moves into the panel. */
export function Tabs({ label, items, selectedKey, defaultSelectedKey, onSelectionChange, forceState, forceHover: legacyHover, forceFocus: legacyFocus, styles }: TabsProps) {
  const forceHover = forceState?.hover ?? legacyHover;
  const forceFocus = forceState?.focus ?? legacyFocus;
  return (
    <AriaTabs
      style={layoutStyle(styles)}
      selectedKey={selectedKey}
      defaultSelectedKey={defaultSelectedKey}
      onSelectionChange={(k) => onSelectionChange?.(String(k))}
      disabledKeys={items.filter((t) => t.isDisabled).map((t) => t.id)}
      className="nk-tabs-root"
    >
      <TabList aria-label={label} className="nk-tabs">
        {items.map((t) => (
          <Tab key={t.id} id={t.id} className={cx("nk-tab", forceHover === t.id && "is-hover", forceFocus === t.id && "is-focus")}>
            {t.label}
            {t.count !== undefined && <span className="nk-count">{t.count}</span>}
          </Tab>
        ))}
      </TabList>
      {items.map((t) => (
        <TabPanel key={t.id} id={t.id} className="nk-tabpanel">
          {t.content}
        </TabPanel>
      ))}
    </AriaTabs>
  );
}
