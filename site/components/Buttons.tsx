"use client";
import Link from "next/link";
import * as Naksha from "naksha";

const N = Naksha as unknown as Record<string, any>;
/* Navigation is a link, never a button (Button README). These are real links wearing Naksha's button classes. */
export function NkButtons({ items, className }: { items: { href: string; label: string; variant: string; iconEnd?: string }[]; className?: string }) {
  return (
    <div className={className}>
      {items.map((b) => (
        <Link key={b.href} href={b.href} className={`nk-btn nk-btn--${b.variant}${b.iconEnd ? " nk-btn--trail" : ""}`}>
          <span>{b.label}</span>{b.iconEnd && <N.Icon name={b.iconEnd} />}
        </Link>
      ))}
    </div>
  );
}
