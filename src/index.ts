export { layoutStyle, LAYOUT_PROPERTIES } from "./styles";
export type { LayoutStyles, LayoutProperty } from "./styles";

/** Naksha release, set by the build. */
export const version: string = typeof __NAKSHA_VERSION__ === "string" ? __NAKSHA_VERSION__ : "dev";

declare const __NAKSHA_VERSION__: string | undefined;
