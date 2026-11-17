import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { layoutStyle, type LayoutStyles } from "../styles";

interface ThreadApi {
  announce: (text: string) => void;
}
const ThreadContext = createContext<ThreadApi | null>(null);

/** @internal */
export const useThread = () => useContext(ThreadContext);

export interface ThreadProps {
  /** ChatMessages, oldest first. */
  children: ReactNode;
  /** Names the conversation for screen readers. */
  label?: string;
  /** A reply is streaming. Screen readers wait for it to finish instead of reading every word. */
  isBusy?: boolean;
  /** Layout only (ADR 0009). Give the thread a height through its parent; it scrolls inside. */
  styles?: LayoutStyles;
}

const BOTTOM = 32; // px from the end that still counts as "reading the newest message"

/**
 * A conversation people move through with the keyboard: Tab reaches the thread once, then arrow keys,
 * Page Up and Page Down move between messages and Home and End jump to the first and last.
 * It stays at the newest message while you are there, never steals focus, and announces each finished reply once.
 */
export function Thread({ children, label = "Conversation", isBusy, styles }: ThreadProps) {
  const feed = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const active = useRef<HTMLElement | null>(null);
  const [message, setMessage] = useState("");

  const articles = () => Array.from(feed.current?.querySelectorAll<HTMLElement>(":scope > .nk-msg") ?? []);

  // One Tab stop: the last message focused, or the newest.
  useLayoutEffect(() => {
    const list = articles();
    const current = active.current && list.includes(active.current) ? active.current : list[list.length - 1];
    list.forEach((a, i) => {
      a.setAttribute("tabindex", a === current ? "0" : "-1");
      a.setAttribute("aria-posinset", String(i + 1));
      a.setAttribute("aria-setsize", String(list.length));
    });
    const el = feed.current;
    if (el && atBottom.current) el.scrollTop = el.scrollHeight;
  });

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const list = articles();
    const from = list.indexOf(e.target as HTMLElement);
    if (from < 0) return;
    const to = { ArrowDown: from + 1, PageDown: from + 1, ArrowUp: from - 1, PageUp: from - 1, Home: 0, End: list.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    const next = list[Math.max(0, Math.min(list.length - 1, to))];
    next?.focus();
  };

  const announce = useCallback((text: string) => {
    // Clear first so the same words twice are still spoken.
    setMessage("");
    requestAnimationFrame(() => setMessage(text));
  }, []);

  return (
    <ThreadContext.Provider value={{ announce }}>
      <div className="nk-thread-host" style={layoutStyle(styles)}>
        <div
          ref={feed}
          role="feed"
          aria-label={label}
          aria-busy={isBusy || undefined}
          className="nk-thread"
          onKeyDown={onKeyDown}
          onFocus={(e) => {
            if ((e.target as HTMLElement).matches(".nk-msg")) {
              active.current = e.target as HTMLElement;
              articles().forEach((a) => a.setAttribute("tabindex", a === e.target ? "0" : "-1"));
            }
          }}
          onScroll={(e) => {
            const el = e.currentTarget;
            atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM;
          }}
        >
          {children}
        </div>
        <div className="nk-sr" aria-live="polite">
          {message}
        </div>
      </div>
    </ThreadContext.Provider>
  );
}
