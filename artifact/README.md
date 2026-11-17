A design system drawn like a set of architectural sheets: paper and ink, square edges, hairline rules, mono sheet labels, and seven section hues that mark where you are. It comes straight from the live portfolio CSS, and it is built for product work: AI tools, fintech, legal and other information-heavy screens.

## Point of view

- **Paper and ink.** Every screen starts on `bg-canvas` (paper, `stone-200`, the portfolio `--c-bg`) with `fg-default` (ink, `stone-950`). Dark mode is the same drawing printed in reverse: ink ground, paper text.
- **Hairlines, not shadows.** Separate things with 1px `border-default` rules. Only things that float (menus, toasts, modals) get `shadow-overlay`, and they keep their hairline.
- **Square edges.** `radius-control` and `radius-surface` are 0. A circle (`radius-round`) appears only where it means something: radio buttons, people, status dots, the spinner.
- **Sheet labels carry information.** Mono caps codes (`RD-02 · FINTECH`, `SHEET 00`) say where a thing sits in the set. Never use them as decoration above every heading.
- **Hues mark sections, not meaning.** `section-read`, `section-build`, `section-pause` and the rest colour swatches, covers and agent avatars. Status meaning comes from the status tokens, always with an icon and words.

## Content and voice

- Plain words, short sentences, first person on personal pages ("I tested it with 15 people"). Sentence case everywhere in the UI; caps only in `mono-label` and display type.
- Buttons are verbs that say what happens: "Save changes", "Explain this paper", "Cancel subscription". Never "OK", "Submit", "Click here".
- Errors say how to fix the problem: "Add the part after the dot, like example.com." not "Invalid email".
- No em or en dashes in visible text. Use a comma, a colon or a full stop.
- Numbers, dates, amounts and counters are `mono-data` with tabular figures: "₹1,250.00", "18 DEC 2026", "0 / 6,000".
- Titles keep the portfolio spacing: "Product Designer / Design Engineer", with spaces around the slash.
- garu, the AI assistant, always writes in lowercase and speaks about Shreeraj in the third person. Every factual answer from garu carries numbered sources.
- Never use: delve, seamless, elevate, unleash, cutting-edge, "passionate about".

## Colour

- Design with semantic tokens only. Primitives (`stone-*`, `blue-*`, `ochre-*` …) are the raw values and exist so the semantic layer can alias them.
- Text: `fg-default` for body and titles, `fg-muted` for secondary text, `fg-subtle` for placeholders and sheet codes, `fg-disabled` only on disabled controls. All hold 4.5:1 on `bg-canvas`, `bg-subtle` and `bg-raised` in both themes (`fg-subtle` on canvas and raised only).
- Surfaces: `bg-canvas` for the page, `bg-raised` for anything you type into or that floats, `bg-subtle` for wells and the user's chat turn, `bg-band` for placeholders, `bg-inverse` for tooltips and toasts.
- Actions: `action-primary` (ink) once per region; `action-highlight` (the portfolio `--action` yellow) for one call to action per page; `action-danger` for destructive actions. Text on each uses its `action-on-*` token, never literal white.
- Status: `status-success-*` (play green), `status-warning-*` (pause ochre), `status-danger-*` (build terracotta), `status-info-*` (read blue). Each has a tint (`-bg`), a text colour (`-fg`, AA on its tint and on the page) and a decorative edge (`-border`).
- Edges: `border-default` for rules, `border-strong` for emphasis and the composer at rest, `border-control` for any control edge (3:1 on every ground).
- `selection` is a highlighter pen: ochre over the drawing.

## Type

- Three families, from the portfolio: **Archivo** for UI and reading, **Archivo Condensed** (Archivo at width 62, weight 800) for display, **IBM Plex Mono** for labels and numbers. **Newsreader** for essays and poetry.
- Display (`display-hero`, `display-xl`, `display-l`) is caps, condensed, with line height 0.8 to 0.9 and negative tracking. One `display-hero` per page.
- Titles: `title-l` (40) for page titles, `title-m` (28) for modals and panels, `title-s` (20) for cards and groups. Weight 600, tracking tightens as size grows.
- Text: `body-l` (17/1.55) for reading and AI answers, at most 64ch wide. `body-m` (15/1.5) is the UI default. `body-s` (13) for helper text and meta. `label-m` and `label-s` (500) for buttons, tabs and field labels.
- Mono: `mono-label` (12, caps, +4% tracking) for sheet codes, tags, column heads and breadcrumbs. `mono-data` (13, tabular) for numbers.
- Desktop sizes shown; on mobile display steps to the low end of the portfolio clamp() (`display-xl` 40, `display-l` 28) and titles drop one step.

## Space and layout

- A 4px scale: `space-4` to `space-128`, plus `space-2` and `space-6` for optical nudges. Dense inside, generous between.
- Inside components: icon to label 8, label to field 8, field to helper 6, control padding 12 to 20, card padding 20, modal padding 24.
- Between things: fields 20 apart, groups `space-32`, sections `layout-section` (128 desktop, 64 mobile).
- Pages: 12 columns (`layout-columns`), with `layout-gutter` (40 desktop, 16 mobile) as both margin and gutter. Top nav is `layout-nav-height` (64).
- Optical alignment beats box alignment: a button with a leading icon drops 2px of padding on that side, and in PromptInput the text and the toolbar glyphs share one 16px left edge.

## Controls and states

- Heights: `size-control-sm` 32, `size-control-md` 40, `size-control-lg` 48 on desktop; 36, 44, 52 under a coarse pointer, so touch targets clear 44px.
- Hover adds `state-hover` (or darkens an action fill) and only applies under `(hover: hover) and (pointer: fine)`.
- Press scales to 0.97 in `dur-press` (140ms) on `ease-out`: the control should feel like it heard you.
- Focus is one method everywhere: a 2px solid `border-focus` outline, 2px off the edge (14:1 on paper, 15:1 on ink). Fields show focus on their own edge, doubled to 2px ink.
- Disabled uses `bg-disabled` and `fg-disabled`. Prefer explaining why something is unavailable over disabling it.
- Loading keeps a button's label and width and adds a Spinner with `aria-busy`.

## Motion

- UI motion stays under 300ms: `dur-hover` 150, `dur-press` 140, `dur-ui` 200, `dur-overlay` 280 (exits at 200). Page motion uses the portfolio's longer steps: `dur-page` 450, `dur-hero` 900.
- `ease-out` (the portfolio `--e-out`) for anything entering or responding; `ease-settle` (`--e-set`) for things settling like paper; `ease-in-out` for things moving between two places (tab rule, switch thumb). Never ease-in.
- Animate transform and opacity only. Menus and tooltips grow from their trigger, from 0.97, never from 0. Modals stay centred.
- Nothing a person triggers by keyboard animates. Tooltips after the first open instantly.
- Under `prefers-reduced-motion`, movement goes and fades stay. The spinner slows to a pulse.

## Iconography

- Lucide icons (ISC), redrawn with a drafting pen: 1.5 stroke on a 24 grid, square caps and mitred joins so they match the square system. They are in the Icons asset group.
- Sizes: `size-icon-sm` 16 in controls, `size-icon-md` 20 in alerts and navigation, `size-icon-lg` 24 standalone.
- Icons take `currentColor`; colour them with a text token. Decorative icons get `aria-hidden`; an icon-only button gets an `aria-label` and a Tooltip with the same words.
- No emoji as icons.

## AI patterns

- People are round, agents are square. An agent always shows its name and an "AI" status.
- Answers that state facts carry numbered SourceChips that match superscripts in the text. The composer says "garu can be wrong. Check the sources."
- People can always interrupt: while streaming, Send becomes Stop.
- Let people steer before they ask: the reading level sits beside Send.

## Accessibility

- WCAG 2.2 AA as the floor: 4.5:1 text, 3:1 control edges and focus, visible focus on every stop, 24px minimum targets (44 on touch).
- Status never relies on colour alone. Links stay underlined. Real `<button>`, `<a>`, `<table>` and form elements, with labels.
- Every token pair named in a usage note has been checked in both themes; the component previews pass axe-core with no serious or critical issues.
