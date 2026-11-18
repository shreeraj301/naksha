import type { ReactElement } from "react";
import { Header, Menu, MenuItem, MenuSection, MenuTrigger, Popover, Separator, type Selection } from "react-aria-components";
import { cx } from "../cx";
import { Icon, type IconName } from "./Icon";
import { renderShortcut } from "./Shortcut";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface MenuAction {
  id: string;
  label: string;
  icon?: IconName;
  /** Shown on the right in mono, for example "⌘C". ⌘ ↵ ⇧ ⌫ are drawn as icons. */
  shortcut?: string;
  /** Destroys something. Put it last, after a separator. */
  isDanger?: boolean;
  isDisabled?: boolean;
}

export interface MenuSeparator {
  separator: true;
}

export type MenuEntry = MenuAction | MenuSeparator;

export interface DropdownMenuProps {
  /** Names the menu for screen readers when it stands alone. Opened from a trigger, React Aria names it by the trigger instead. */
  label: string;
  /** The button that opens it: usually a ghost IconButton with `ellipsis`. */
  trigger?: ReactElement;
  items: MenuEntry[];
  onAction?: (id: string) => void;
  /** A mono heading at the top of the list. Group long menus; seven items before you group. */
  title?: string;
  /** "single" makes the items a choice with a check on the current one. */
  selectionMode?: "none" | "single";
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (id: string) => void;
  placement?: "bottom start" | "bottom end" | "top start" | "top end";
  /** Preview only: draw the open list in the flow, without a trigger. */
  isInline?: boolean;
  /** Preview only: the item id to draw in each state, e.g. `{ hover: … }`. */
  forceState?: { hover?: string };
  /** @deprecated Use `forceState={{ hover }}`. Removed in 0.6.0. */
  forceHover?: string;
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

const isSeparator = (e: MenuEntry): e is MenuSeparator => "separator" in e;

/** A list of actions or choices that opens from a trigger. Focus moves into the list; arrow keys move, Enter acts, Escape closes and returns focus to the trigger. */
export function DropdownMenu({
  label, trigger, items, onAction, title, selectionMode = "none", selectedKey, defaultSelectedKey, onSelectionChange, placement = "bottom start", isInline, forceState, forceHover: legacyHover, styles,
}: DropdownMenuProps) {
  const forceHover = forceState?.hover ?? legacyHover;
  const entries = items.map((e, i) =>
    isSeparator(e) ? (
      <Separator key={`sep-${i}`} className="nk-menu__sep" />
    ) : (
      <MenuItem
        key={e.id}
        id={e.id}
        textValue={e.label}
        isDisabled={e.isDisabled}
        className={({ isFocused }) => cx("nk-menu__item", e.isDanger && "nk-menu__item--danger", (isFocused || forceHover === e.id) && "is-hover")}
      >
        {({ isSelected }) => (
          <>
            {e.icon && <Icon name={e.icon} />}
            <span>{e.label}</span>
            {e.shortcut && <kbd>{renderShortcut(e.shortcut)}</kbd>}
            {isSelected && <Icon name="check" className="nk-i nk-menu__check" />}
          </>
        )}
      </MenuItem>
    ),
  );
  const keys = (k?: string) => (k === undefined ? undefined : [k]);
  const menu = (
    <Menu
      style={layoutStyle(styles)}
      aria-label={label}
      className="nk-menu"
      onAction={(key) => onAction?.(String(key))}
      selectionMode={selectionMode}
      selectedKeys={keys(selectedKey)}
      defaultSelectedKeys={keys(defaultSelectedKey)}
      onSelectionChange={(sel: Selection) => {
        if (sel === "all") return;
        const [first] = [...sel];
        if (first !== undefined) onSelectionChange?.(String(first));
      }}
    >
      {title ? (
        <MenuSection>
          <Header className="nk-menu__group">{title}</Header>
          {entries}
        </MenuSection>
      ) : (
        entries
      )}
    </Menu>
  );
  if (isInline || !trigger) return menu;
  return (
    <MenuTrigger>
      {trigger}
      <Popover offset={4} placement={placement} className="nk-popover">
        {menu}
      </Popover>
    </MenuTrigger>
  );
}
