# Naksha roadmap

Updated 17 Nov 2026. Each phase ends with a done-check, and nothing moves on until it passes. I review each phase before it is merged and published.

| Phase | What | Status |
| --- | --- | --- |
| 0 | Repo, token source and build, tests, lint, CI, decisions | Done (0.1.0, 0.2.0) |
| 1 | React components on React Aria, running live in the artifact | Next |
| 2 | Components still missing | Scope written when Phase 1 ends |
| 3 | Charts | |
| 4 | Icon library, about 310 icons in tiers | |
| 5 | Patterns built from the components | |
| 6 | Access and language: Devanagari font, en-IN formatter | |
| 7 | Brand assets | |
| 8 | 1.0 | |

---

## Phase 1: React components

**Goal.** Every component exists as a typed React component built on React Aria Components, and every artifact preview renders that real component instead of hand-written HTML. What the artifact shows is what the code does.

**Checked before planning (17 Nov 2026)**

- react-aria-components 1.22.1 (released 9 Oct 2026) supports React 16.8 to 19. The artifact loads React 18, so it fits.
- Every primitive this plan names exists in 1.22.1: Button, ToggleButtonGroup, TextField, TextArea, Select, ListBox, Popover, Checkbox, RadioGroup, Switch, Menu, Modal, Dialog, Tooltip, Disclosure, Breadcrumbs, Separator, Link, Table, TagGroup, Tabs, ProgressBar, I18nProvider.
- Toast is still `UNSTABLE_ToastRegion` / `UNSTABLE_ToastQueue`. Its API may change between releases.
- Bundle size, minified with React left out: 48 KB (16 KB gzip) for Button and the text fields; 236 KB (73 KB gzip) with all the primitives above. The artifact allows 6 MB.
- The artifact's rules for a bundle: one classic script that sets `window.<namespace>`, reads `window.React`, no imports, no network, no `</script` or `<!--` inside. The test bundle contains neither string.
- React Aria marks states with `data-hovered`, `data-pressed`, `data-focus-visible`, `data-disabled`, `data-invalid`, `data-selected`, `data-entering`, `data-exiting`. The CSS will target these.

### Step 0. Groundwork (nothing visible changes)

1. **Fluid type.** The portfolio's type is fluid (measured 17 Nov 2026):
   `--t-mega` 72 to 304px, `--t-xl` 40 to 100px, `--t-l` 28 to 52px, `--t-m` 20 to 28px, `--t-body` 17 to 19px.
   My pick: the display styles and `title-m` take these clamps in `naksha.css`, the same way the layout tokens do (largest size in `$value`, `min` and `fluid` in the extension). Titles without a portfolio clamp keep their documented step at `bp.medium`. Body sizes stay fixed: changing reading size is a separate decision.
2. **Tooling.** TypeScript sources in `src/`, esbuild for the bundle, Vitest with Testing Library for behaviour, axe-core in Playwright for accessibility, and the screenshot comparison harness moved into the repo as `tests/visual`. New dev dependencies are pinned to versions at least two weeks old.
3. **Artifact plumbing.** The build writes `components/bundle.js` with its `@ds-bundle` header, `components/index.d.ts` (props, which the artifact turns into API cards), and React 18.3.1 into `components/lib/` so previews never depend on a CDN. The index namespace changes from `SN` to `Naksha`.
4. **Class prefix.** `.sn-` becomes `.nk-`. Every preview gets rewritten in this phase anyway, so the rename costs nothing extra now and a lot later.

Done when: an empty bundle loads in the artifact with no errors, and CI runs unit, accessibility and screenshot tests.

### Step 1. Thin slice: Button and PromptInput

These two prove the whole pipeline, from source to bundle to preview to republish. Then I pause and you review.

- **Button and IconButton.** Five variants (primary, secondary, ghost, highlight, danger), three sizes, loading state (`aria-busy`, label kept for screen readers), icon slots, press scale 0.97 at 140ms that is skipped for keyboard presses and reduced motion. Previews show hover and pressed side by side using a preview-only `forceState` prop.
- **PromptInput.** TextArea that grows from 2 to 8 lines, Enter sends, Shift+Enter adds a line, send turns into stop while a reply streams, attachment chips, send disabled when empty. Enter must not send while an input method is still composing (`isComposing`), so Hindi and Marathi typing with an IME works.

Done when, for both: previews render from the bundle in both themes; screenshots match today's previews with no visible change (any difference gets reviewed, not waved through); axe reports zero serious or critical issues; keyboard tests pass; the artifact is republished.

### Step 2. Form controls

Input, Textarea, Select, Checkbox, Radio, Switch, SegmentedControl (ToggleButtonGroup). Shared Field parts for label, helper, error and character count, so every control lays out label to field, field to helper the same way.

### Step 3. Overlays

DropdownMenu, Modal, Tooltip, Toast. Focus moves in on open and back on close, Escape closes, the page behind cannot be tabbed into. Because Toast is unstable upstream, it sits behind our own small API so an upstream change touches one file.

### Step 4. AI set

ChatMessage (user, assistant, error, streaming), SourceChip, SuggestionChip, the thinking indicator. Streaming text is announced politely to screen readers, not word by word.

### Step 5. Everything else

Accordion (Disclosure), Alert, Avatar, Breadcrumb, Card, Divider (Separator), EmptyState, Kbd, Link, ProgressBar, Skeleton, Spinner, Table, Tabs, Tag (TagGroup), TopNav.

### Phase 1 is done when

- All 33 previews and the cover render from the bundle, in both themes.
- Screenshots match the 0.2.0 previews, or every difference has been reviewed.
- axe: zero serious or critical issues across all previews.
- Every component has typed props in `index.d.ts`, a README with usage rules, and tests for keyboard use and states.
- CI is green and the artifact is republished. Version 0.3.0.

---

## Phases 2 to 8

Each gets a plan like the one above when the phase before it ends, written from what exists then, not from guesses now.

- **2. Components still missing.** The gap list from our earlier review is re-derived against the Phase 1 inventory, then scoped.
- **3. Charts.** Line, bar, area and the stat tile, using the section colours as the series palette. Contrast and colour-blind checks are part of the done-check.
- **4. Icon library.** About 310 icons in tiers, drawn on the same pen as today's 38 (1.5px stroke, square caps, mitred joins, 24px grid).
- **5. Patterns.** Built only from the components, nothing new: forms, empty and error states, AI flows.
- **6. Access and language.** Ship Noto Sans Devanagari (ADR 0005) after a visual pass with real Hindi and Marathi copy, and the en-IN formatter with the three-letter month fix (ADR 0006).
- **7. Brand assets.** To be scoped.
- **8. 1.0.** API frozen, versioned releases, docs complete.

## Decisions log

All in [`docs/adr`](adr). Closed on 17 Nov 2026: 0002 to 0006 and 0008. Open: fluid type (Phase 1, step 0).
