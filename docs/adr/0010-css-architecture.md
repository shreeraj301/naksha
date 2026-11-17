# 0010. Cascade layers, rem, forced colours, reduced motion

Status: Accepted · 17 Nov 2026

Context for all four: `docs/research/design-systems-2026-11.md`, items 3 to 5 and 11.

## Cascade layers

`naksha.css` declares `@layer naksha.tokens, naksha.base, naksha.components;` and `components.css` sits in `naksha.components`. A product's own CSS, written outside any layer, now beats Naksha without `!important` or specificity tricks, and a CSS reset can be put in a lower layer. A Playwright test checks that an unlayered rule wins.

## rem

Spacing, sizes and type in `naksha.css` and every length in `components.css` above 2px are written in rem (px / 16). Token names do not change: `space-16` is still 16px at the default root size. A reader who sets a larger browser font now gets larger gaps and controls, not only larger text.

Stays in px: border widths (`border.hairline`, `border.thick`), 1px and 2px optical nudges, `radius-round`, and breakpoints. The artifact keeps px in `tokens.json`, because its previews are fixed 960px frames and px reads better in its token tables. The JS export keeps numbers in px.

Proof: all 68 previews (34 components, light and dark) match the 0.2.0 screenshots within 4 pixels.

Lint: stylelint rejects any px value above 2 in `css/`.

## Forced colours (Windows High Contrast)

In forced colours the browser replaces colours with system colours and drops backgrounds, which erased every indicator drawn with a background: the radio dot, switch thumb, selected segment, tab and nav underline, progress bar, menu highlight and skeletons. Those opt out (`forced-color-adjust: none`) and use `CanvasText`, `Highlight`, `HighlightText` and `GrayText`. The block sits last in `components.css`. Fifteen components have forced-colour screenshots.

## Reduced motion

Before: every transition dropped to 1ms. Now nothing moves (transforms are not transitioned, presses do not scale, the indeterminate bar pulses instead of sliding) but colour, border and opacity changes keep their timing, so a state change is still readable. `naksha.css` also shortens `dur-overlay`, `dur-page` and `dur-hero` to 150ms and `dur-press` to 0. Astryx makes the same choice: it caps durations rather than removing them (Astryx 0.7.16, `docs tokens`).

## Prefix

Classes and keyframes moved from `sn-` to `nk-`. The JS namespace is `Naksha`.
