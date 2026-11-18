"use client";
import { UNSAFE_PortalProvider } from "react-aria";
import type { ReactNode } from "react";

/* Popovers, tooltips and dialogs that React Aria portals out of a preview land at the end of <main>, not loose in
   <body>, so everything on the page stays inside a landmark. <main> is not positioned, so they sit where they would
   in <body>. */
const container = () => document.getElementById("portals") ?? document.body;

export function Portals({ children }: { children: ReactNode }) {
  return <UNSAFE_PortalProvider getContainer={container}>{children}</UNSAFE_PortalProvider>;
}
