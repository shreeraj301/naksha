# Naksha site: art direction

Three directions for the Naksha website, judged against the Awwwards bar. Pick one; nothing in `site/` gets built until then. The mock-ups in this folder are static pages that load the real Naksha CSS and live components from `dist/` (run `npm run build` first, then serve the repo root).

| Direction | Home | Component page |
|---|---|---|
| A. The map | `a-map-home.html` | `a-map-component.html` |
| B. Measured drawing (recommended) | `b-drawing-home.html` | `b-drawing-component.html` |
| C. Syntax of behaviour | `c-syntax-home.html` | `c-syntax-component.html` |

## The site

Naksha's website is the public home of the design system. It has two kinds of reader. A person, usually me or someone I hand a project to, comes to look a component up, copy the code and check the rules. An agent (Claude, or anything that reads `AGENTS.md`) comes to read the same rules as text so it builds with Naksha instead of guessing.

So the site has one job: answer "how do I use this?" fast, for both readers, and look like it was made by the person who made the system.

Pages in v1, as agreed:

- Home
- Getting started, plus the AI page (the skill, the `AGENTS.md` block, Copy as Markdown, a `.md` twin of every page, `llms.txt`)
- Foundations (colour, type, space, layout, motion, radius and shadow, icons), from the tokens
- Components, all 34, with live examples, props from the types and the accessibility record
- Brand book
- Changelog and roadmap, from `CHANGELOG.md` and `docs/ROADMAP.md`
- Search, a light and dark switch, and a designed 404

Stack: Next.js static export in `site/`, deployed by me on Vercel with `site/` as the root.

## What the Awwwards bar means for a docs site

Juries weight Design 40%, Usability 30%, Creativity 20% and Content 10%. Sites of the Day average around 7.2 to 7.6. Most award winners are portfolios and launches, so they earn a loader, WebGL and smooth scroll. A docs site doesn't. Usability carries more weight here than anywhere else: people arrive from search, jump to an anchor, use find in page and the back button. That sets the theatre level:

- No loader, no WebGL, no smooth-scroll library. Native scroll stays, because anchors and find in page depend on it.
- One signature moment, used everywhere it helps someone understand a component. Everything around it stays quiet.
- Craft goes into type, layout and the states of every control, which is what Naksha already is.

Patterns from recent winners that do apply (from the awwwards skill's notes on 2026 winners):

- Type does the work: one grotesk family, display sizes with tight negative tracking, small confident UI text.
- Index lists with a live preview on hover, as on Obys, for the component list.
- Primary targets answer with movement, not a colour swap alone. Utility links (legal, social) may only change colour.
- Something keeps moving at rest when the concept calls for it, and the motion is the concept itself, never a decorative wobble.
- The footer and the 404 are designed as compositions and carry the concept.
- The native cursor stays. No custom cursor.

## Fixed by Naksha

The site is built from Naksha, so these are settled and the directions only decide how they are used:

- Palette: paper (`stone-200` #e8e4dc in light, `stone-950` #151413 in dark) and ink, the ochre highlight #e2c463, and the seven section hues (read, build, pause, play, sit, gather, plug).
- Type: Archivo Condensed for display, Archivo for text and UI, IBM Plex Mono for data, Newsreader for long reading only.
- Corners: 0 everywhere. Motion: the duration tokens (140 press, 150 hover, 200 UI, 280 overlay, 450 page) and `ease-out`.

One risk to name. Warm paper with a serif and a terracotta accent is the most common AI-generated look right now. Naksha avoids it if ink and paper lead, Newsreader stays inside long reading (brand book, the AI page), and terracotta only appears as one section hue among seven. All three mock-ups set display type in Archivo Condensed 800 for that reason.

## The three concepts

Each comes from a different source, as the method asks.

### A. The map (from the name)

Naksha is Hindi for a map or plan. The site is the map of the system: 34 components laid out as plots in seven districts, one district per section hue.

- Signature: on the home page the plan is the index. Opening a plot zooms the map into it, and the plot becomes the component page header. Every component page keeps a small locator map with the current plot filled in.
- Motion verb: zoom and settle, like moving across a plan.
- Screenshot: the full plan with every plot running its live component.
- Anchor: the meaning of the name.
- Weak spots: the districts need a real rule for their size, and a zoom transition between pages is the most expensive thing to build of the three. Hatched plots in the mock-up stand in for components not wired up yet; the real site renders every plot live.

### B. Measured drawing (from the material: architecture)

Every component is documented the way an architect draws a construction detail: drawn large, dimensioned and annotated. The dimension strings measure the live component in the browser and name the token behind each number, so the drawing can't drift from the code.

- Signature: the drawing. On the home page a Button is drawn at 3 : 1 with its height (40, `size-control-md`), padding (16, `space-16`), width, corners and label set out. At rest it steps through Rest, Hover, Pressed and Focus and measures again each time. On a component page you change variant, size or input (pointer or touch) and the dimensions redraw: touch reads 44, `size-control-touch-md`.
- Motion verb: draw on, like a plotter. Lines extend from the edge being measured, then the number settles beside them.
- Screenshot: the dimensioned Button on the grid.
- Anchor: I trained as an architect, every README already has an "Anatomy and spacing" section, and every number comes from a real token.
- Weak spots: components with no fixed size (Table, Card, Thread) need a different drawing (spacing between parts instead of outer size). The mock-up only draws Button.

This is different from the earlier "sheet set" idea: no title block, grid letters or sheet codes, which I dropped from the portfolio. The drawing conventions are only there where they carry a measurement.

### C. Syntax of behaviour (from how I work)

My thesis was "Syntax of Behaviour", and React Aria is a library of behaviours. The site reads every component as a sequence: what you do, and what it does back.

- Signature: the score. On the home page a short form plays as a score: one row per component, one column per action (Tab, type, Space, Enter), marks in the section hues, and a playhead. Real key presses drive it. Each component page has a behaviour table: one row per state, one column per way of using it (pointer, touch, keyboard and screen reader).
- Motion verb: step, like a beat. Discrete moves with short holds.
- Screenshot: the score with the playhead on Enter.
- Anchor: the thesis title, React Aria, and the tested states in every README.
- Weak spots: it is the most abstract of the three, so a first-time visitor needs a second look to get it. The score takes the most new content to write.

### Scores

1 to 5. Portability asks whether the idea could be moved to someone else's system: lower is better.

| | Originality | Fit | Feasible in code | Portability | Helps people use the docs |
|---|---|---|---|---|---|
| A. The map | 4 | 5 | 3 | 2 | 3 |
| B. Measured drawing | 4 | 5 | 4 | 2 | 5 |
| C. Syntax of behaviour | 5 | 4 | 3 | 2 | 4 |

These scores are judgment calls, not measurements.

## Recommendation: B, with one idea each from A and C

B is the one where the concept and the documentation are the same thing. The dimensions answer a question people ask a design system ("how tall is this, which token is that?"), and because they are measured live they stay true. That helps Usability and Content as much as Creativity.

Take from A: the locator map. It becomes the 404 (an empty plot: "Nothing is built here yet") and the small map on component pages, so you always know which group you are in.

Take from C: the behaviour table. It becomes the States section of every component page, in place of the current testing table.

### System for B

- Grid: 12 columns, gutter 24, outer margin 32 on desktop; 4 columns and 16 margins on phones. Text and drawings hang from column 1 and column 6.
- Ground: paper. Drawings sit on a raised panel with a 16 px grid (32 on the home board), the only place a grid shows.
- Type scale: display in Archivo Condensed 800 at `clamp(3.25rem, 1rem + 5.4vw, 6.5rem)`, leading 0.88, tracking -0.02em. Body 16 to 19 px at 1.5. Dimensions and data in Plex Mono 13 and 11, tabular figures.
- Line weights: drawing lines 1 px in ink, extension lines 0.75 px muted, ticks at 45 degrees, 1.5 px.
- Hover treatments, one per role. Component rows in the index slide right and show their drawing. Primary buttons use Naksha's own press. Text links draw their underline. Nav items move the current-page rule.
- At rest: the home drawing steps through its states every 1.8 s. Under reduced motion it stays at Rest and the four state labels become buttons.
- Page transition: the drawing on the page you open draws on. No full-page wipes.
- Footer: the wordmark set large, with the release number and the last change, from the changelog.

### Home, section by section

```
1 Poster    | A design system      | [ drawing board: live Button, 3:1,   |
            | for my products.     |   dimensions + state steps ]          |
            | lede · Get started   |                                       |
2 Index     | Components ........ group ........ one fact ...... one size  |
            | (row hover: the row's drawing opens beside it)               |
3 Pair      | Foundations: the token tables drawn as a scale   | text      |
4 Statement | "Built for an agent to read." Copy as Markdown, llms.txt    |
5 Footer    | NAKSHA (huge) · 0.3.0 · last change · links                  |
```

### Genericness check

What a generic docs site would do, and what changes here:

- A hero with a blob or a product screenshot. Here the hero is a measured component.
- A grid of identical component cards. Here it is an index list where each row opens its drawing.
- A props table as the only spec. Here the drawing gives the sizes and the props table keeps the API.

## Phone

- A: districts stack, plots in two columns, the locator sits above the title.
- B: the drawing scales to 1.25 : 1 and moves to the left so the dimensions fit. Leader notes hide below 560 px, the dimension strings stay. Controls wrap to three rows.
- C: the score scrolls sideways inside its own frame; the page never does.

All six mock-ups were checked at 1440 and 390 with no horizontal overflow and no console errors.

## Not decided yet

- Component groups. The repo has no categories, so the seven groups in the mock-ups (Actions, Forms, Overlays, AI, Feedback, Navigation, Surfaces) are a proposal. Seven groups to seven hues is neat, but the mapping of group to hue is mine and open to change.
- Dark mode for the drawings. The lines use ink tokens, so they should flip with the theme, but I haven't checked them in dark yet.
