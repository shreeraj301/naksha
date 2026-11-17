import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

const KEYS: Record<string, [IconName, string]> = {
  "⌘": ["command", "Command"],
  "↵": ["corner-down-left", "Enter"],
  "⇧": ["arrow-big-up", "Shift"],
  "⌫": ["delete", "Delete"],
};

/**
 * @internal Turns "⌘K" into the drawn command icon followed by K. No Naksha font has ⌘ ↵ ⇧ ⌫, so they are icons,
 * each named for screen readers. Other characters stay text. Write the shortcut for the platform you are on.
 */
export function renderShortcut(shortcut: string): ReactNode[] {
  return Array.from(shortcut).map((ch, i) => {
    const key = KEYS[ch];
    return key ? <Icon key={i} name={key[0]} label={key[1]} /> : ch;
  });
}
