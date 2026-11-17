import { renderShortcut } from "./Shortcut";

export interface KbdProps {
  /** One key: "K", "Esc", "⌘". ⌘ ↵ ⇧ ⌫ are drawn icons, named for screen readers. */
  children: string;
}

/** A key on the keyboard. One per key: write ⌘ K as <Kbd>⌘</Kbd> <Kbd>K</Kbd>. */
export function Kbd({ children }: KbdProps) {
  return <kbd className="nk-kbd">{renderShortcut(children)}</kbd>;
}
