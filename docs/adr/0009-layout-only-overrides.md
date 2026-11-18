# 0009. Components accept layout overrides only

Status: Accepted · 17 Nov 2026

## Context

A component that lets a product change its colour or inner padding drifts within a release: every product ends up with its own button. React Spectrum solves this in the API. Its components take a `styles` prop limited to margin, width, flex and grid placement, position and z-index; colour and inner padding cannot be overridden (react-spectrum.adobe.com/styling, checked 17 Nov 2026).

## Decision

- Every Naksha React component accepts `styles?: LayoutStyles`: each entry in `src/components.json`, on its outer element (for a group, the group: `RadioGroup`, `Toaster`, `List`; for an overlay, its panel). `tests/unit/styles-everywhere.test.tsx` renders every one with `styles` and fails if it doesn't land. Until 19 Nov 2026 only 16 of the 41 did. `LayoutStyles` is typed to the properties in `LAYOUT_PROPERTIES` (`src/styles.ts`): margin, width, flex and grid placement, position, inset, z-index, visibility.
- At runtime `layoutStyle()` keeps those and drops anything else, with a warning outside production.
- Components do not pass `className` or `style` through to their visual parts.
- A product that needs a different look asks for a variant in Naksha. It does not override one locally.

## Consequences

- Drift has to go through the system, which is the point.
- Some one-off needs will feel blocked. That friction is the signal that a variant is missing.
- Plain CSS users (no React) can still override anything. Cascade layers (ADR 0010) make that predictable, and stylelint keeps Naksha's own CSS on tokens where tokens exist: no raw colours, z-index only from `--z-*`, font sizes only from the type scale, durations only from `--dur-*`, and no px above 2. Other lengths inside components (icon boxes, track widths, max widths) are plain rem, because they have no token.
