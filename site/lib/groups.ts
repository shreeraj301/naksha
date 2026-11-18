/* The seven component groups come from each card's @dsCard group in artifact/components/<Name>/preview.html.
   Which section hue each group wears is a site decision. */
export const GROUP_ORDER = ["Actions", "Forms", "Navigation", "Feedback", "Surfaces", "AI", "Identity"] as const;
export type Group = (typeof GROUP_ORDER)[number];
export const HUE: Record<Group, string> = {
  Actions: "build",
  Forms: "pause",
  Navigation: "read",
  Feedback: "sit",
  Surfaces: "gather",
  AI: "plug",
  Identity: "play",
};
export const hueVar = (g: Group) => `var(--section-${HUE[g]})`;
