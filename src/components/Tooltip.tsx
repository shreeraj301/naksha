import type { ReactElement, ReactNode } from "react";
import { Tooltip as AriaTooltip, TooltipTrigger } from "react-aria-components";
import { renderShortcut } from "./Shortcut";

export interface TooltipProps {
  /** A few words: the control's name, or what it does. Never something a person needs to finish a task. */
  content: ReactNode;
  /** Shown as a key after the text, for example "⌘K". ⌘ ↵ ⇧ ⌫ are drawn as icons. */
  shortcut?: string;
  /** The control it describes: a Naksha Button or IconButton (anything built on React Aria's Button). */
  children: ReactElement;
  placement?: "top" | "bottom" | "left" | "right";
  /** Hover delay in ms. Keyboard focus shows it at once. Once one tooltip is open, neighbours open with no delay. */
  delay?: number;
  isDisabled?: boolean;
  /** Preview only: keep it open. */
  isOpen?: boolean;
  /** Preview only: draw the bubble alone, in the flow, without a trigger. */
  isInline?: boolean;
}

/** Names an icon-only control or shows its shortcut, on hover after 400ms and at once on keyboard focus. Escape hides it. */
export function Tooltip({ content, shortcut, children, placement = "top", delay = 400, isDisabled, isOpen, isInline }: TooltipProps) {
  const bubble = (
    <>
      {content}
      {shortcut && <span className="nk-kbd">{renderShortcut(shortcut)}</span>}
    </>
  );
  if (isInline) return <span className="nk-tooltip">{bubble}</span>;
  return (
    <TooltipTrigger delay={delay} closeDelay={0} isDisabled={isDisabled} isOpen={isOpen}>
      {children}
      <AriaTooltip offset={6} placement={placement} className="nk-tooltip">
        {bubble}
      </AriaTooltip>
    </TooltipTrigger>
  );
}
