# Naksha site: art direction

## D. Combined (the pick)

`naksha.html` and `naksha-button.html`. One direction built from the best of A, B and C.

Kept:

- From A: the breathing NAKSHA hero, every component name solved to fill the page on the width axis, and the index where the row under the pointer stretches and shows its live component. Dark ground.
- From C: the seven groups as colour bands. Here they filter the index: pick AI and the list shows its five components. The stretched row takes its group colour, and so does the preview panel. Component pages open on a band in their group colour, with the fitted name across it.
- From B: Ask Naksha, as a section on the home page instead of the whole home page, and "Ask about Button" beside the docs on every component page.

Left out:

- C's whole-page colour changes and its seven full screens, one per group. The colour now marks the group without taking over the page.
- B's question as the hero. The name leads; the demo comes after the components.
- The facts row (192, 2, 40, 0) and the slogan footers. The footer is links and the release.

The open questions at the end of this file still apply.

# Round 2: the three directions


Round 1 (the map, the measured drawing, the behaviour score) read as too quiet. This round goes bolder. All three directions drop the architecture references and lean on Naksha's own strongest material: the Archivo type family, the AI set and the seven section colours.

Each direction has a home page and a Button page, built from the real Naksha CSS and live components. Open `index.html` here after `npm run build`, serving the repo root, or use the published artifact.

| Direction | Home | Component page | Ground |
|---|---|---|---|
| A. Elastic | `a-elastic.html` | `a-elastic-button.html` | Dark |
| B. Ask Naksha | `b-ask.html` | `b-ask-button.html` | Dark |
| C. Seven fields | `c-fields.html` | `c-fields-button.html` | Light |

## What the site has to do

The site is where people and agents learn to build with Naksha. A person looks a component up, copies the code and checks the rules. An agent reads the same rules as text (`llms.txt`, the `AGENTS.md` block, a Markdown twin of every page). The pages agreed for v1: home, getting started and the AI page, foundations, all 34 components, brand book, changelog and roadmap, search, a light and dark switch, and a designed 404.

Awwwards juries weight Design 40%, Usability 30%, Creativity 20%, Content 10%. A docs site can be as bold as any portfolio in type, colour and motion, but it can't spend Usability: no loader, no scroll hijacking, anchors and find in page keep working, and every page reads fine with motion off.

## A. Elastic

Naksha's display face is Archivo pinned to its narrowest width. This direction releases the width axis (Archivo's full variable font, 62 to 125, OFL, shipped by the site only) and makes type the instrument.

- Signature: the name NAKSHA fills the screen and breathes. A fixed width budget pours into the letters near the pointer, so one letter swells while the others give way and the word always keeps its measure. With the pointer still, a slow wave runs through it.
- Every component name follows one rule: its width axis is solved so the name fills the page exactly. BUTTON comes out wide, SEGMENTEDCONTROL comes out narrow. The page says which width it landed on.
- Index: all 34 names as a list. The row under the pointer stretches to full width and its live component appears in the panel beside it. On phones, the row crossing the middle of the screen does the same.
- Motion verb: stretch and settle.
- Feel: black, paper type, one ochre button per page. The most "award site" of the three.

## B. Ask Naksha

Naksha has an AI-native set (PromptInput, Thread, ChatMessage, ResponseStatus, SourceChip). This direction makes the site out of it.

- Signature: the home page asks "What are you building?" and answers by building interface live from Naksha components. Pick "A sign-in form" and the steps run (reading the Forms docs, picking 4 parts, checking both themes), then the form appears, working, with source chips that link to each component page. "A toast that can undo" gives you a button that fires a real Naksha toast. Typed requests are matched to the three demos; anything else gets an honest "this demo knows three requests". It is scripted and says so.
- Component pages: "Ask about Button". Suggested questions answer from the README, with chips pointing at the section they quote.
- Motion verb: answer step by step.
- Feel: dark, quiet, very large condensed type, the product demonstrating itself. The most unusual of the three for a design system, and the one an agent-first audience will remember.

## C. Seven fields

Seven component groups, seven section colours. The site turns colour as you scroll.

- Signature: the first screen is seven full-height colour bands, one per group. Pointing at a band widens it and shows one of its live components. Each group then gets its own screen: the page ground turns to that group's colour, the group name is set at about a quarter of the screen width, and its components hang on the field as a wall of live tiles.
- Component pages wear their group's colour: Button sits on terracotta, with its name set huge across the band.
- Motion verb: the ground changes colour, the type stays ink.
- Feel: loud, warm, poster-like. The most colourful and the most "brand".

## What carries across all three

- Naksha tokens throughout: paper and ink, ochre highlight, section hues, 0 corners, the duration tokens.
- Primary targets move when you point at them (rows stretch, bands widen, tiles lift, arrows travel, nav underlines draw). Utility links only change colour.
- The native cursor stays. Reduced motion stops the wave, the stretch and the colour fades, and every page is complete without them.
- Checked at 1440 and 390: no sideways scroll, no console errors, and axe finds no serious or critical issues on any of the seven pages.

## Open questions

- The seven groups and their colours are a proposal; the repo has no categories yet.
- A needs one extra font file (Archivo with the width axis, about 90 KB). Naksha itself would not change.
- B's answers are scripted. A real model behind it is possible later but is not part of v1.
