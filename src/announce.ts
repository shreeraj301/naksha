/**
 * announce(): say a short message to screen readers without moving focus.
 * One pair of live regions per page, made on first use. Each message is a new node in a log, so the same words
 * said twice are read twice, and each node is removed after 7 seconds so the log never grows.
 * The same approach as React Aria's internal LiveAnnouncer (Apache 2.0), written here because that one is private.
 */
export interface AnnounceOptions {
  /** Read it at once, cutting off whatever is being read. Only for errors that stop the person. Default: wait for a pause. */
  interrupt?: boolean;
}

const KEEP_MS = 7000;
let root: HTMLDivElement | null = null;
let polite: HTMLDivElement | null = null;
let assertive: HTMLDivElement | null = null;

function log(live: "polite" | "assertive") {
  const el = document.createElement("div");
  el.setAttribute("role", "log");
  el.setAttribute("aria-live", live);
  el.setAttribute("aria-relevant", "additions");
  return el;
}

function mount() {
  root = document.createElement("div");
  root.setAttribute("data-nk-announcer", "");
  // Visually hidden, written inline so it works before (or without) Naksha's stylesheet.
  Object.assign(root.style, {
    position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden",
    clip: "rect(0 0 0 0)", clipPath: "inset(50%)", whiteSpace: "nowrap", border: "0",
  });
  assertive = log("assertive");
  polite = log("polite");
  root.append(assertive, polite);
  document.body.prepend(root);
}

/** Say `message` to screen readers. Nothing shows on screen and focus stays where it is. Does nothing on the server. */
export function announce(message: string, { interrupt = false }: AnnounceOptions = {}): void {
  if (typeof document === "undefined" || !message.trim()) return;
  const fresh = !root || !root.isConnected;
  if (fresh) mount();
  const say = () => {
    const node = document.createElement("div");
    node.textContent = message;
    (interrupt ? assertive : polite)!.appendChild(node);
    setTimeout(() => node.remove(), KEEP_MS);
  };
  // Safari misses text added to a live region in the same moment the region appears, so the first message waits a beat.
  if (fresh) setTimeout(say, 100);
  else say();
}
