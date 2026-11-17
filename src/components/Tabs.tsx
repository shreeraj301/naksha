import type { ReactNode } from "react";
import { Tab, TabList, TabPanel, Tabs as AriaTabs } from "react-aria-components";
import { cx } from "../cx";

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
  /** Preview only. */
  forceHover?: string;
  forceFocus?: string;
}

/** Views of one thing, side by side. Arrow keys move between tabs; Tab moves into the panel. */
export function Tabs({ label, items, selectedKey, defaultSelectedKey, onSelectionChange, forceHover, forceFocus }: TabsProps) {
  return (
    <AriaTabs
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
