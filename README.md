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
| **40 components** | In `css/components.css`: buttons, toggles, fields, sliders, menus, tables, lists, images, modals, drawers, toasts, and the AI set (prompt input, messages, steps, sources) |

## Use it

```html
<html data-theme="dark">  <!-- or "light"; leave it off to follow the OS -->
  <link rel="stylesheet" href="dist/css/naksha.css">
  <link rel="stylesheet" href="dist/css/components.css">
```

```js
import { Button, PromptInput } from "naksha";
import { color, space, dur, ease, cssVar } from "naksha/tokens";

color.dark["bg-canvas"];   // "#151413"
space["16"];               // 16 (px at the default root; the CSS writes 1rem)
cssVar("fg-muted");        // "var(--fg-muted)"
```

Naksha's CSS sits in cascade layers, so your own CSS wins without `!important`. Sizes are in rem, so they grow with the reader's browser font size. It works in Windows High Contrast and respects reduced motion.

## Use it with AI agents

Naksha ships an Agent Skill, generated from the same sources as the CSS.

```sh
npx skills add shreeraj301/naksha --skill naksha          # install the skill for your agent
npx github:shreeraj301/naksha init-agents . --agent claude   # add the Naksha rules block to AGENTS.md and CLAUDE.md
```

The block sits between `NAKSHA:START` and `NAKSHA:END`; running the command again refreshes it and never touches anything else in the file.

## One source, four outputs

```
tokens/                     W3C DTCG 2025.10, the only place values are edited
  naksha.resolver.json      how the files combine; the theme modifier swaps light and dark
  primitives/               raw palette
  themes/                   semantic colour and elevation, per theme
  dimension, layout, motion, typography
artifact/                   hand-made artifact files: component previews, brand book, icons
css/components.css          the component stylesheet

npm run build  ->  dist/css        CSS variables, themes, fonts, type classes, @custom-media
                   dist/js         ES module + TypeScript types (tokens, and the React layer)
                   dist/artifact   the whole Claude artifact: artifact/ + generated tokens, CSS, fonts, bundle.js, React 18.3.1
                   skills/naksha   the Agent Skill (committed, so it can be installed from GitHub)
```

## Work on it

```sh
npm install
npm run build    # write dist/
npm test             # build, then token checks (aliases, DTCG, contrast in both themes, propagation), skill checks, unit tests
npm run test:visual  # every preview in light, dark and forced colours against saved screenshots, axe on each
npm run lint         # no raw colours, no px above 2 in css/
npm run check        # all of the above plus the type check
```

## Decisions

Written down in [`docs/adr`](docs/adr): why GitHub is the source of truth, the token format, naming, breakpoints and the fluid grid, fluid type, Devanagari, Indian number grouping (₹1,25,000), why there is no Figma library, and the one contrast pair kept on purpose.

## Roadmap

Phases 0 and 1 are done: every component is a React component on React Aria and runs live in the artifact. Phase 2, the components still missing, is under way. The full plan, with a done-check for each step, is in [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Licence

Code is MIT. The fonts in `fonts/` are under the SIL Open Font License 1.1; their licences are in [`fonts/licenses`](fonts/licenses). Archivo Condensed is an instance of Archivo pinned to width 62.
