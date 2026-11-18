# 0011. Display type is fluid; reading type is not

Status: Accepted · 18 Nov 2026 (in effect since 0.2.1; this records it)

## Context

The portfolio's type is fluid. Measured on 17 Nov 2026: `--t-mega` 72 to 304px, `--t-xl` 40 to 100px, `--t-l` 28 to 52px, `--t-m` 20 to 28px and `--t-body` 17 to 19px, each a `clamp()` on the viewport width.

Naksha's type styles had one size each. The layout tokens already solved the same problem (ADR 0004): DTCG has no type for `clamp()`, so the token's `$value` is the largest size, `$extensions["dev.naksha"].min` the smallest, and `.fluid` the CSS that `naksha.css` writes.

## Decision

The display styles and `title-m` take the portfolio's clamps, stored the same way as the layout tokens:

| Style | Smallest | Largest | CSS in `naksha.css` |
| --- | --- | --- | --- |
| `display-hero` | 72px | 304px | `clamp(4.5rem, 0.6rem + 17vw, 19rem)` |
| `display-xl` | 40px | 100px | `clamp(2.5rem, 1.2rem + 5.4vw, 6.25rem)` |
| `display-l` | 28px | 52px | `clamp(1.75rem, 1.25rem + 2.1vw, 3.25rem)` |
| `title-m` | 20px | 28px | `clamp(1.25rem, 1.08rem + 0.7vw, 1.75rem)` |

`title-l` has no portfolio clamp, so it keeps its step: 40px, and 28px below `bp-medium`.

Body, label and mono styles stay fixed. The artifact shows every style at its largest size, because its previews sit in a fixed frame.

## Why the reading sizes stay fixed

The portfolio's body grows from 17 to 19px with the window. Naksha already writes type in rem, so a reader who wants larger text gets it from their browser setting, which is the size they chose. Growing it again with the window would make line length and rhythm in components (fields, tables, the chat) depend on the window, which is harder to test and gives nothing a reader asked for.

## Revisit

If a long-form page (a case study, the brand book) reads small on large screens, add a separate fluid `serif-body` for reading pages rather than making `body-*` fluid.
