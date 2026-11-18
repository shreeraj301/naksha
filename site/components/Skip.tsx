"use client";
import * as Naksha from "naksha";

const N = Naksha as unknown as Record<string, any>;
/* Naksha's SkipLink, here because it handles a click and the layout is a server component. */
export function Skip() {
  return <N.SkipLink />;
}
