import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import {
  Button as AriaButton,
  Text,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  UNSTABLE_ToastStateContext as ToastStateContext,
  type QueuedToast,
} from "react-aria-components";
import { cx } from "../cx";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

/*
 * Naksha's own small toast API over React Aria's toast region, which React Aria still marks UNSTABLE.
 * If that API changes, only this file changes. Behaviour follows Emil Kowalski's Sonner:
 * a stack that expands on hover, CSS transitions (they retarget mid-flight, keyframes do not),
 * swipe down to dismiss with a velocity check, and timers that pause on hover, focus and a hidden tab.
 */

export type ToastTone = "neutral" | "success" | "danger";

export interface ToastAction {
  /** One verb: "Undo", "Retry", "View". */
  label: string;
  onPress: () => void;
}

export interface ToastOptions {
  tone?: ToastTone;
  /** A toast with an action stays until it is used or dismissed. */
  action?: ToastAction;
  /** Milliseconds before it leaves on its own. 5000 by default; `Infinity` keeps it. Ignored when there is an action. */
  duration?: number;
  onClose?: () => void;
}

/** @internal */
export interface ToastContent {
  message: ReactNode;
  tone: ToastTone;
  action?: ToastAction;
  duration: number;
  onClose?: () => void;
}

const DEFAULT_DURATION = 5000;
const EXIT_MS = 200;
const GAP = 8; // px between expanded toasts, and the peek of each toast behind the front one
const SWIPE_DISTANCE = 40; // px down that dismisses
const SWIPE_VELOCITY = 0.11; // px per ms, from Sonner: a quick flick dismisses before the distance
const SWIPE_MIN = 8; // px: a flick still has to travel this far, so a tap that jitters does not dismiss

function makeQueue() {
  return new ToastQueue<ToastContent>({ maxVisibleToasts: 3 });
}

/** The queue `toast()` writes to and `<Toaster />` shows. */
const globalQueue = makeQueue();

/* Toasts on their way out stay rendered for EXIT_MS so they can fade, then leave the queue. */
const leaving = new Set<string>();
const listeners = new Set<() => void>();
let version = 0;
const emit = () => {
  version++;
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

function dismissFrom(queue: ToastQueue<ToastContent>, key: string) {
  if (leaving.has(key)) return;
  leaving.add(key);
  emit();
  setTimeout(() => {
    queue.close(key);
    leaving.delete(key);
    emit();
  }, EXIT_MS);
}

/** Show a toast. Returns its id, for `toast.dismiss(id)`. Put one `<Toaster />` in the app. */
export function toast(message: ReactNode, options: ToastOptions = {}): string {
  const { tone = "neutral", action, duration = DEFAULT_DURATION, onClose } = options;
  return globalQueue.add({ message, tone, action, duration: action ? Infinity : duration, onClose });
}
toast.success = (message: ReactNode, options: Omit<ToastOptions, "tone"> = {}) => toast(message, { ...options, tone: "success" });
toast.error = (message: ReactNode, options: Omit<ToastOptions, "tone"> = {}) => toast(message, { ...options, tone: "danger" });
toast.dismiss = (id: string) => dismissFrom(globalQueue, id);

export interface ToasterProps {
  /** Preview only: show these toasts at rest, without timers: as a list, or as the collapsed stack. */
  preview?: { layout: "list" | "stack"; toasts: Array<{ message: ReactNode; tone?: ToastTone; action?: ToastAction }> };
}

/** Where toasts appear: bottom left, 16 from the edges. Place it once, near the root. F6 moves focus to it. */
export function Toaster({ preview }: ToasterProps) {
  const [queue] = useState(() => {
    if (!preview) return globalQueue;
    const q = makeQueue();
    [...preview.toasts].reverse().forEach((t) => q.add({ message: t.message, tone: t.tone ?? "neutral", action: t.action, duration: Infinity }));
    return q;
  });
  useSyncExternalStore(subscribe, () => version, () => version);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const hidden = useDocumentHidden();
  const [heights, setHeights] = useState<Record<string, number>>({});
  const layout = preview?.layout;
  const expanded = layout === "list" || (!layout && (hovered || focused));
  const paused = expanded || hidden || Boolean(preview);

  const keys = queue.visibleToasts.map((t) => t.key);
  const frontHeight = heights[keys[0] ?? ""] ?? 0;

  const renderItem = (t: QueuedToast<ToastContent>) => {
    const index = keys.indexOf(t.key);
    let before = 0;
    for (let i = 0; i < index; i++) before += heights[keys[i]!] ?? 0;
    return (
      <ToastItem
        key={t.key}
        toast={t}
        queue={queue}
        index={index}
        count={keys.length}
        offset={before + index * GAP}
        frontHeight={frontHeight}
        expanded={expanded}
        paused={paused}
        onHeight={(h) => setHeights((prev) => (prev[t.key] === h ? prev : { ...prev, [t.key]: h }))}
      />
    );
  };

  return (
    <div
      className="nk-toaster-host"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      {preview ? (
        // React Aria portals its region to <body>; a preview draws the same toasts in the flow instead.
        <ToastStateContext.Provider value={queue}>
          <div className={cx("nk-toaster", layout === "list" ? "nk-toaster--list" : "nk-toaster--stack")}>{queue.visibleToasts.map((t) => renderItem(t))}</div>
        </ToastStateContext.Provider>
      ) : (
        <AriaToastRegion queue={queue} className="nk-toaster">
          {({ toast: t }) => renderItem(t)}
        </AriaToastRegion>
      )}
    </div>
  );
}

const ICONS: Record<ToastTone, "circle-check" | "circle-alert" | null> = { neutral: null, success: "circle-check", danger: "circle-alert" };

interface ToastItemProps {
  toast: QueuedToast<ToastContent>;
  queue: ToastQueue<ToastContent>;
  index: number;
  count: number;
  offset: number;
  frontHeight: number;
  expanded: boolean;
  paused: boolean;
  onHeight: (h: number) => void;
}

function ToastItem({ toast: t, queue, index, count, offset, frontHeight, expanded, paused, onHeight }: ToastItemProps) {
  const { message, tone, action, duration, onClose } = t.content;
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const removed = leaving.has(t.key);
  const close = () => {
    onClose?.();
    dismissFrom(queue, t.key);
  };

  // Measure once, while it is the front toast and nothing constrains its height.
  useLayoutEffect(() => {
    if (ref.current) onHeight(ref.current.getBoundingClientRect().height);
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useTimer(duration, paused || removed, close);
  const swipe = useSwipe(ref, close);

  const icon = ICONS[tone];
  return (
    <AriaToast
      ref={ref}
      toast={t}
      className={cx("nk-toast", `nk-toast--${tone}`)}
      data-index={index}
      data-front={index === 0 || undefined}
      data-mounted={mounted || undefined}
      data-expanded={expanded || undefined}
      data-removed={removed || undefined}
      data-swiping={swipe.swiping || undefined}
      style={
        {
          "--index": index,
          "--z": count - index,
          "--offset": `${offset}px`,
          "--front-height": `${frontHeight}px`,
          "--gap": `${GAP}px`,
        } as CSSProperties
      }
      onPointerDown={swipe.onPointerDown}
      onPointerMove={swipe.onPointerMove}
      onPointerUp={swipe.onPointerUp}
      onPointerCancel={swipe.onPointerUp}
    >
      {icon && <Icon name={icon} />}
      <AriaToastContent className="nk-toast__msg">
        <Text slot="title">{message}</Text>
      </AriaToastContent>
      {action && (
        <AriaButton
          className="nk-toast__action"
          onPress={() => {
            action.onPress();
            close();
          }}
        >
          {action.label}
        </AriaButton>
      )}
      <IconButton label="Dismiss" icon="x" variant="ghost" size="sm" onPress={close} />
    </AriaToast>
  );
}

function useTimer(duration: number, paused: boolean, onDone: () => void) {
  const remaining = useRef(duration);
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    if (paused || !Number.isFinite(remaining.current)) return;
    const start = Date.now();
    const id = setTimeout(() => done.current(), remaining.current);
    return () => {
      clearTimeout(id);
      remaining.current -= Date.now() - start;
    };
  }, [paused]);
}

function useDocumentHidden() {
  return useSyncExternalStore(
    (cb) => {
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => document.hidden,
    () => false,
  );
}

/** Swipe down to dismiss: past SWIPE_DISTANCE, or faster than SWIPE_VELOCITY. Dragging up meets friction and springs back. */
function useSwipe(ref: React.RefObject<HTMLDivElement | null>, onDismiss: () => void) {
  const start = useRef<{ y: number; t: number } | null>(null);
  const [swiping, setSwiping] = useState(false);
  const set = (px: number) => ref.current?.style.setProperty("--swipe", `${px}px`);
  return {
    swiping,
    onPointerDown(e: PointerEvent<HTMLDivElement>) {
      if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
      start.current = { y: e.clientY, t: Date.now() };
      e.currentTarget.setPointerCapture(e.pointerId);
      setSwiping(true);
    },
    onPointerMove(e: PointerEvent<HTMLDivElement>) {
      if (!start.current) return;
      const dy = e.clientY - start.current.y;
      set(dy >= 0 ? dy : -Math.pow(-dy, 0.5));
    },
    onPointerUp(e: PointerEvent<HTMLDivElement>) {
      if (!start.current) return;
      const dy = e.clientY - start.current.y;
      const velocity = Math.abs(dy) / Math.max(1, Date.now() - start.current.t);
      start.current = null;
      setSwiping(false);
      if (dy >= SWIPE_DISTANCE || (dy >= SWIPE_MIN && velocity > SWIPE_VELOCITY)) onDismiss();
      else set(0);
    },
  };
}

/** The same component as Toaster, under the name of the design system's Toast card. */
export const Toast = Toaster;
export type ToastProps = ToasterProps;
