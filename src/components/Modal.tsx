import type { ReactNode } from "react";
import { Dialog, DialogTrigger, Heading, Modal as AriaModal, ModalOverlay } from "react-aria-components";
import { IconButton } from "./IconButton";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface ModalProps {
  /** The question the modal asks: "Cancel this subscription?". */
  title: string;
  /** The facts a person needs to decide. A string becomes one paragraph. */
  children: ReactNode;
  /** The answers, as verbs: secondary first, primary or danger last. A function gets `close`. */
  footer?: ReactNode | ((close: () => void) => ReactNode);
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Close on a click outside. Off by default: a modal is for a decision, and a stray click is not one. Escape always closes. */
  isDismissable?: boolean;
  /** Preview only: draw the dialog in the flow, without the overlay. */
  isInline?: boolean;
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

function Parts({ title, children, footer, close }: Pick<ModalProps, "title" | "children" | "footer"> & { close: () => void }) {
  return (
    <>
      <div className="nk-modal__head">
        <Heading slot="title" level={2} className="nk-modal__title">
          {title}
        </Heading>
        <IconButton label="Close" icon="x" size="sm" variant="ghost" onPress={close} />
      </div>
      <div className="nk-modal__body">{typeof children === "string" ? <p>{children}</p> : children}</div>
      {footer && <div className="nk-modal__foot">{typeof footer === "function" ? footer(close) : footer}</div>}
    </>
  );
}

/**
 * Blocks the page for one decision. Focus moves in on open and stays inside, the page behind cannot be reached
 * with Tab or a screen reader, Escape closes, and focus returns to what opened it.
 */
export function Modal({ title, children, footer, isOpen, defaultOpen, onOpenChange, isDismissable = false, isInline, styles }: ModalProps) {
  const dialog = (
    <Dialog className="nk-modal" style={layoutStyle(styles)}>
      {({ close }) => (
        <Parts title={title} footer={footer} close={close}>
          {children}
        </Parts>
      )}
    </Dialog>
  );
  if (isInline) return dialog;
  return (
    <ModalOverlay className="nk-overlay" isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange} isDismissable={isDismissable}>
      <AriaModal className="nk-modal-frame">{dialog}</AriaModal>
    </ModalOverlay>
  );
}

/** Wraps a trigger and a Modal: pressing the trigger opens it, closing returns focus to the trigger. */
export const ModalTrigger = DialogTrigger;
