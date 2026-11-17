# Naksha

**नक्शा** · *the plan, the map, the drawing you build from.*

Naksha is the design system I use for everything I make. It is drawn the way an architect draws a set of sheets: ink on paper, square corners, a 12-column grid, and the dimensions left showing in redline so you can see why a thing is the size it is.

I trained as an architect before I designed software. A good plan reads at a glance, and the walls tell you where to walk without a sign. Naksha tries to do the same for interfaces, from a button to an AI chat that thinks out loud.

> Every token, component and pattern starts here. The Claude artifact, where you can see and browse the whole system, is built from this repo and never edited by hand.

## What is in it today

| | |
| --- | --- |
| **192 tokens** | Colour (paper and ink, seven section colours, four status sets), space, size, radius, stroke, layout, breakpoints, motion, z-index, type |
| **Two themes** | Light (ink on paper) and dark (paper on ink). Every semantic colour exists in both, and every text pair is tested for WCAG 2.2 AA |
| **15 type styles** | Archivo Condensed for display, Archivo for UI, Newsreader for reading, IBM Plex Mono for data |
| **33 components** | In `css/components.css`: buttons, fields, menus, tables, modals, toasts, and the AI set (prompt input, messages, sources, thinking) |

## Use it

```html
<html data-theme="dark">  <!-- or "light"; leave it off to follow the OS -->
  <link rel="stylesheet" href="dist/css/naksha.css">
  <link rel="stylesheet" href="dist/css/components.css">
```

```js
import { color, space, dur, ease, cssVar } from "naksha/tokens";

color.dark["bg-canvas"];   // "#151413"
space["16"];               // 16
cssVar("fg-muted");        // "var(--fg-muted)"
```

## One source, three outputs

```
tokens/                     W3C DTCG 2025.10, the only place values are edited
  naksha.resolver.json      how the files combine; the theme modifier swaps light and dark
  primitives/               raw palette
  themes/                   semantic colour and elevation, per theme
  dimension, layout, motion, typography
artifact/                   hand-made artifact files: component previews, brand book, icons
css/components.css          the component stylesheet

npm run build  ->  dist/css        CSS variables, themes, fonts, type classes, @custom-media
                   dist/js         ES module + TypeScript types
                   dist/artifact   the whole Claude artifact: artifact/ + generated tokens, CSS, fonts
```

## Work on it

```sh
npm install
npm run build    # write dist/
npm test         # build, then check aliases, DTCG shapes, contrast in both themes, and that one change reaches every output
npm run lint     # no raw colours or stray pixel spacing in css/
```

## Decisions

Written down in [`docs/adr`](docs/adr): why GitHub is the source of truth, the token format, naming, breakpoints, Devanagari, Indian number grouping (₹1,25,000), how the artifact stays in sync, and why there is no Figma library.

## Roadmap

| Phase | |
| --- | --- |
| 0 | Repo, token source and build, tests, lint, CI ← *here* |
| 1 | React components on top of the CSS |
| 2 | The components still missing from the gap list |
| 3 | Charts |
| 4 | A drawn icon library, about 310 icons in tiers |
| 5 | Patterns built from the components |
| 6 | Access and language: Devanagari, Indian number and date formats |
| 7 | Brand assets |
| 8 | 1.0 |

## Licence

Code is MIT. The fonts in `fonts/` are under the SIL Open Font License 1.1; their licences are in [`fonts/licenses`](fonts/licenses). Archivo Condensed is an instance of Archivo pinned to width 62.
