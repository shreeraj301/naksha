import { renderShortcut } from "./Shortcut";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface KbdProps {
  /** One key: "K", "Esc", "⌘". ⌘ ↵ ⇧ ⌫ are drawn icons, named for screen readers. */
  children: string;
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

/** A key on the keyboard. One per key: write ⌘ K as <Kbd>⌘</Kbd> <Kbd>K</Kbd>. */
export function Kbd({ children, styles }: KbdProps) {
  return <kbd className="nk-kbd" style={layoutStyle(styles)}>{renderShortcut(children)}</kbd>;
}
