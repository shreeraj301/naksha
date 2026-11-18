import { useEffect, useRef, useState, type ReactNode } from "react";
import { Dialog, Link as AriaLink, Modal, ModalOverlay } from "react-aria-components";
import { cx } from "../cx";
import { IconButton } from "./IconButton";

export type Section = "read" | "build" | "pause" | "play" | "sit" | "gather" | "plug";

export interface NavItem {
  label: string;
  /** The mono line under the label: "Work", "Architecture". */
  sub?: string;
  href: string;
  /** The section colour of its square. */
  section: Section;
  isCurrent?: boolean;
}

export interface TopNavProps {
  name: string;
  /** The line under the name: "Product Designer / Design Engineer". */
  role?: string;
  homeHref?: string;
  items?: NavItem[];
  /** Controls on the right, such as the Human / Agent SegmentedControl. On a phone they move into the menu sheet. */
  trailing?: ReactNode;
  /** The phone version: name and a menu button that opens the menu sheet. */
  isCompact?: boolean;
  /** The bar steps aside while the reader scrolls down and comes back on the way up. Makes the bar sticky. */
  hideOnScroll?: boolean;
  /** Under the sections in the menu sheet: contact, résumé, social links. */
  menuFooter?: ReactNode;
  /** Controls the menu sheet. Leave both out and TopNav manages it. */
  isMenuOpen?: boolean;
  onMenuChange?: (isOpen: boolean) => void;
  /**
   * @deprecated since 0.3.1. With `onMenu`, Naksha draws no sheet and the product opens its own menu.
   * Use `onMenuChange` instead.
   */
  onMenu?: () => void;
  /** Preview only: the item label to draw hovered. */
  forceHover?: string;
  /** Preview only: draw the open menu sheet in place of the bar, instead of over the page. */
  previewMenu?: boolean;
}

/**
 * The bar hides on the way down and returns on the way up, like the portfolio header: it comes back near the top,
 * on any upward scroll of more than 4px, whenever focus is inside it, and while the menu is open.
 * @internal
 */
export function useHideOnScroll(enabled: boolean, ref: React.RefObject<HTMLElement | null>, isHeld: boolean) {
  const [hidden, setHidden] = useState(false);
  const held = useRef(isHeld);
  held.current = isHeld;
  useEffect(() => {
    if (!enabled) { setHidden(false); return; }
    let last = window.scrollY, frame = 0;
    const tick = () => {
      frame = 0;
      const y = window.scrollY;
      const focusInside = !!ref.current && ref.current.contains(document.activeElement);
      if (y < 120 || y < last - 4 || focusInside || held.current) setHidden(false);
      else if (y > last + 4) setHidden(true);
      last = y;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const onFocus = () => setHidden(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    const el = ref.current;
    el?.addEventListener("focusin", onFocus);
    return () => { window.removeEventListener("scroll", onScroll); el?.removeEventListener("focusin", onFocus); if (frame) cancelAnimationFrame(frame); };
  }, [enabled, ref]);
  return hidden && !isHeld;
}

function Identity({ name, role, homeHref, onPress }: { name: string; role?: string; homeHref: string; onPress?: () => void }) {
  return (
    <AriaLink className="nk-nav__id" href={homeHref} onPress={onPress}>
      <span className="nk-nav__name">{name}</span>
      {role && <span className="nk-nav__role">{role}</span>}
    </AriaLink>
  );
}

function SheetBody({ name, role, homeHref, items, trailing, menuFooter, close }: Pick<TopNavProps, "name" | "role" | "items" | "trailing" | "menuFooter"> & { homeHref: string; close: () => void }) {
  return (
    <>
      <div className="nk-nav nk-nav--compact nk-sheet__bar">
        <Identity name={name} role={role} homeHref={homeHref} onPress={close} />
        <IconButton label="Close menu" icon="x" variant="ghost" onPress={close} />
      </div>
      <nav className="nk-sheet__nav" aria-label="Sections">
        <ul className="nk-sheet__list">
          {(items ?? []).map((it, i) => (
            <li key={it.label} style={{ ["--i" as string]: i }}>
              <AriaLink
                href={it.href}
                className="nk-sheetitem"
                aria-current={it.isCurrent ? "page" : undefined}
                style={{ ["--sw" as string]: `var(--section-${it.section})` }}
                onPress={close}
              >
                <i />
                <b>{it.label}</b>
                {it.sub && <small>{it.sub}</small>}
              </AriaLink>
            </li>
          ))}
        </ul>
        {trailing && <div className="nk-sheet__tools">{trailing}</div>}
        {menuFooter && <div className="nk-sheet__foot">{menuFooter}</div>}
      </nav>
    </>
  );
}

/**
 * The site's top bar: identity on the left, sections with their colour squares, and room for a control on the right.
 * Compact, it becomes the name and a menu button that opens a full-screen sheet of the same sections.
 */
export function TopNav({
  name, role, homeHref = "/", items = [], trailing, isCompact, hideOnScroll, menuFooter,
  isMenuOpen, onMenuChange, onMenu, forceHover, previewMenu,
}: TopNavProps) {
  const ref = useRef<HTMLElement>(null);
  const [ownOpen, setOwnOpen] = useState(false);
  const controlled = isMenuOpen !== undefined;
  const open = controlled ? Boolean(isMenuOpen) : ownOpen;
  const setOpen = (v: boolean) => { if (!controlled) setOwnOpen(v); onMenuChange?.(v); };
  const hidden = useHideOnScroll(Boolean(hideOnScroll), ref, open);
  const drawsSheet = !onMenu;

  if (isCompact && drawsSheet && previewMenu) {
    return (
      <div className="nk-sheet nk-sheet--inline" role="group" aria-label="Menu">
        <SheetBody name={name} role={role} homeHref={homeHref} items={items} trailing={trailing} menuFooter={menuFooter} close={() => {}} />
      </div>
    );
  }

  return (
    <>
      <header
        ref={ref}
        className={cx("nk-nav", isCompact && "nk-nav--compact", hideOnScroll && "nk-nav--sticky")}
        data-hidden={hidden || undefined}
      >
        <Identity name={name} role={role} homeHref={homeHref} />
        {isCompact ? (
          <IconButton
            label="Open menu"
            icon="menu"
            variant="ghost"
            aria-expanded={open}
            aria-haspopup="dialog"
            onPress={() => (drawsSheet ? setOpen(!open) : onMenu?.())}
          />
        ) : (
          <>
            <nav className="nk-nav__items" aria-label="Sections">
              {items.map((it) => (
                <AriaLink
                  key={it.label}
                  href={it.href}
                  className={cx("nk-navitem", forceHover === it.label && "is-hover")}
                  aria-current={it.isCurrent ? "page" : undefined}
                  style={{ ["--sw" as string]: `var(--section-${it.section})` }}
                >
                  <i />
                  <b>{it.label}</b>
                  {it.sub && <small>{it.sub}</small>}
                </AriaLink>
              ))}
            </nav>
            {trailing}
          </>
        )}
      </header>
      {isCompact && drawsSheet && (
        <ModalOverlay className="nk-sheet-overlay" isOpen={open} onOpenChange={setOpen} isDismissable={false}>
          <Modal className="nk-sheet">
            <Dialog className="nk-sheet__dialog" aria-label="Menu">
              {({ close }) => <SheetBody name={name} role={role} homeHref={homeHref} items={items} trailing={trailing} menuFooter={menuFooter} close={close} />}
            </Dialog>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
}
