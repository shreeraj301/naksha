# 0004. Breakpoints follow window classes

Status: Proposed · 17 Nov 2026

## Context

v2 had mobile values for the gutter, unit and section gap but no breakpoint to switch them.

## Decision

Four min-width breakpoints, taken from Material 3 window size classes:

| Token | Min width | Starts |
| --- | --- | --- |
| `bp.medium` | 600px | Mobile layout values stop |
| `bp.expanded` | 840px | Two-column layouts |
| `bp.large` | 1200px | Full 12-column grid |
| `bp.xlarge` | 1600px | Content stops growing |

Below `bp.medium` the build swaps `layout.gutter` to 16px, `layout.unit` to 8px and `layout.section` to 64px.

CSS variables cannot sit inside a media query, so the build also writes `dist/css/custom-media.css` and exports the numbers in JS.

## Open

- These are not measured from the portfolio. Check them against its real breakpoints before 1.0.
- Display sizes on mobile (display-xl 40px, display-l 28px) are written in usage notes only. They become tokens in Phase 1.
