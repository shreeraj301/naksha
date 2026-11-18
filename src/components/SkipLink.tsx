import type { MouseEvent, ReactNode } from "react";
import { cx } from "../cx";

export interface SkipLinkProps {
  /** The id of the main content. The page's `<main>` should carry it. */
  target?: string;
  /** What it says. Keep it "Skip to content" unless the page has a better name for its main part. */
  children?: ReactNode;
  /** Preview only: show it as it looks when focused. */
  forceState?: "focus";
}

/**
 * The first stop on the page for keyboard users. Hidden until Tab reaches it; Enter moves focus past the
 * navigation to the main content. Put it first in `<body>`, before the TopNav.
 */
export function SkipLink({ target = "main", children = "Skip to content", forceState }: SkipLinkProps) {
  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(target);
    if (!el) return; // no target: the plain link still jumps to #target
    event.preventDefault();
    // A <main> cannot take focus on its own. Make it focusable from script only, and drop the ring the browser would draw round the whole page.
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.setAttribute("data-nk-skip-target", "");
    el.focus();
  };
  return (
    <a href={`#${target}`} onClick={skip} className={cx("nk-skip", forceState === "focus" && "is-focus")}>
      {children}
    </a>
  );
}
