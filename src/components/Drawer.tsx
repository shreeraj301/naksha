import type { ReactNode } from "react";
import { Dialog, DialogTrigger, Heading, Modal as AriaModal, ModalOverlay } from "react-aria-components";
import { cx } from "../cx";
import { IconButton } from "./IconButton";

export interface DrawerProps {
  /** What the drawer holds, as a name: "New project", "Index", "Filters". */
  title: string;
  /** The task or the list. It scrolls on its own; the title and footer stay put. */
  children: ReactNode;
  /** The actions, as verbs: secondary first, primary last. A function gets `close`. */
  footer?: ReactNode | ((close: () => void) => ReactNode);
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** The edge it slides in from. `end` is the right in a left-to-right page. */
  side?: "start" | "end";
  /** Close on a click outside. Off by default, so a half-filled form is not lost to a stray click. Turn it on for a list of links. Escape always closes. */
  isDismissable?: boolean;
  /** Preview only: draw the panel in the flow, without the overlay. */
  isInline?: boolean;
}

/**
 * A panel that slides in from the side for a short task or a list, while the page stays in view behind it.
 * The same dialog as Modal: focus moves in and stays, the page behind is hidden from screen readers,
 * Escape closes, and focus returns to what opened it.
 */
export function Drawer({ title, children, footer, isOpen, defaultOpen, onOpenChange, side = "end", isDismissable = false, isInline }: DrawerProps) {
  const dialog = (
    <Dialog className={cx("nk-drawer", side === "start" && "nk-drawer--start", isInline && "nk-drawer--inline")}>
      {({ close }) => (
        <>
          <div className="nk-modal__head">
            <Heading slot="title" level={2} className="nk-modal__title">
              {title}
            </Heading>
            <IconButton label="Close" icon="x" size="sm" variant="ghost" onPress={close} />
          </div>
          <div className="nk-drawer__body">{typeof children === "string" ? <p>{children}</p> : children}</div>
          {footer && <div className="nk-modal__foot">{typeof footer === "function" ? footer(close) : footer}</div>}
        </>
      )}
    </Dialog>
  );
  if (isInline) return dialog;
  return (
    <ModalOverlay
      className={cx("nk-overlay nk-overlay--drawer", side === "start" && "nk-overlay--start")}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
    >
      <AriaModal className="nk-drawer-frame">{dialog}</AriaModal>
    </ModalOverlay>
  );
}

/** Wraps a trigger and a Drawer: pressing the trigger opens it, closing returns focus to the trigger. */
export const DrawerTrigger = DialogTrigger;
