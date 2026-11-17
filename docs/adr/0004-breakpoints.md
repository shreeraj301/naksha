# 0004. Breakpoints and a fluid page grid, measured from the portfolio

Status: Accepted · 17 Nov 2026 (replaces the proposed Material 3 values)

## Context

The first draft took Material 3 window classes (600, 840, 1200, 1600). That was a guess. On 17 Nov 2026 I read every media query and root variable off the live portfolio home page in a browser (Chrome 156).

What the portfolio uses:

| Query | Count |
| --- | --- |
| `width <= 899px`, `width >= 900px`, `600px to 899px` | 25 |
| `width <= 599px`, `600px to 899px` | 6 |
| `width <= 767px` or `>= 768px` (4 of the 9 combined with `hover: none`) | 9 |
| `width <= 1199px` | 2 |
| `width >= 1440px` | 1 |
| one-offs: 359, 699, 1180, 1365 | 1 or 2 each |

And the page grid is fluid, not stepped: `--gutter: clamp(1rem, .55rem + 1.9vw, 2.5rem)` and `--u: clamp(.5rem, .35rem + .6vw, 1rem)`.

## Decision

Breakpoints are min-widths, taken from the queries the portfolio actually leans on:

| Token | Min width | Starts |
| --- | --- | --- |
| `bp.medium` | 600px | Phones end |
| `bp.expanded` | 900px | Two-column layouts (the portfolio's main switch) |
| `bp.large` | 1200px | Full desktop grid |
| `bp.xlarge` | 1440px | Wide screens |

768px is not a breakpoint. Where the portfolio pairs it with `hover: none`, it is really asking "is this touch?", which Naksha answers with `pointer: coarse` (the touch control sizes in `components.css`), not width. Width-only layouts at 768px fold into 600px or 900px.

The page grid is fluid, copied exactly:

- `layout.gutter`: 16px to 40px, the portfolio clamp.
- `layout.unit`: 8px to 16px, the portfolio clamp.
- `layout.section`: 8 units, so 64px to 128px.

DTCG has no type for `clamp()`. The token's `$value` is the largest size, `$extensions["dev.naksha"].min` the smallest, and `.fluid` the CSS. `dist/css/naksha.css` uses the fluid CSS. The artifact shows the largest size, because its previews are a fixed 960px frame.

## Open

- Type is fluid on the portfolio too (`--t-xl`, `--t-l`, `--t-m`, `--t-body`, `--t-mega`). That decision is part of Phase 1, step 0 in the roadmap.
