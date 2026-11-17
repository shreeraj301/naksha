# Naksha roadmap

Updated 18 Nov 2026, after Phase 1 step 4. Each phase ends with a done-check, and nothing moves on until it passes. I review each phase before it is merged and published.

| Phase | What | Status |
| --- | --- | --- |
| 0 | Repo, token source and build, tests, lint, CI, decisions | Done (0.1.0, 0.2.0) |
| 1 | React components on React Aria, running live in the artifact | Steps 0 to 4 done (0.2.5); step 5 next |
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

Changed on 17 Nov 2026 by the research in [`research/design-systems-2026-11.md`](research/design-systems-2026-11.md). Items 5 to 10 are new.

1. **Fluid type.** The portfolio's type is fluid (measured 17 Nov 2026):
   `--t-mega` 72 to 304px, `--t-xl` 40 to 100px, `--t-l` 28 to 52px, `--t-m` 20 to 28px, `--t-body` 17 to 19px.
   My pick: the display styles and `title-m` take these clamps in `naksha.css`, the same way the layout tokens do (largest size in `$value`, `min` and `fluid` in the extension). Titles without a portfolio clamp keep their documented step at `bp.medium`. Body sizes stay fixed: changing reading size is a separate decision.
2. **Tooling.** TypeScript sources in `src/`, esbuild for the bundle, Vitest with Testing Library for behaviour, axe-core in Playwright for accessibility, and the screenshot comparison harness moved into the repo as `tests/visual`. New dev dependencies are pinned to versions at least two weeks old.
3. **Artifact plumbing.** The build writes `components/bundle.js` with its `@ds-bundle` header, `components/index.d.ts` (props, which the artifact turns into API cards), and React 18.3.1 into `components/lib/` so previews never depend on a CDN. The index namespace changes from `SN` to `Naksha`.
4. **Class prefix.** `.sn-` becomes `.nk-`. Every preview gets rewritten in this phase anyway, so the rename costs nothing extra now and a lot later.

5. **Cascade layers.** Tokens and components go into `@layer naksha.tokens, naksha.base, naksha.components`, so a product's own CSS wins predictably and a reset can sit below.
6. **rem output.** Spacing, sizes and type are written in rem (names unchanged), so they grow with the reader's browser font size. Screenshots at the default size must not change.
7. **Forced colours.** Every control gets a `forced-colors` rule so edges, focus and selection survive Windows High Contrast.
8. **Layout-only overrides.** Components accept a `styles` prop limited to margin, width, flex and grid placement, position and z-index. Nothing reaches colour or inner padding. Recorded as an ADR.
9. **Reduced motion.** Replace "every transition at 1ms" with: no movement (slide, scale), short fades kept, durations capped.
10. **The Naksha skill.** The build generates an Agent Skill (`skills/naksha/SKILL.md`) and a marked block for a product's `AGENTS.md` / `CLAUDE.md` from the tokens, brand book and component READMEs. No MCP server. Reviews follow one evidence rule: every finding cites a file, line or rendered state; missing evidence is "not inspected", never a pass.

Status: done in 0.2.1, except that the real artifact load is confirmed on the next publish (the bundle already loads in a frame that copies the artifact's).

Found on the way: the ⌘ ↵ ⇧ ⌫ glyphs in Kbd, DropdownMenu, IconButton, Tooltip and PromptInput are in none of Naksha's fonts, so every reader sees a system fallback. Step 2 draws them as icons.

Done when: an empty bundle loads in the artifact with no errors; CI runs unit, accessibility and screenshot tests; previews look identical after the rem and layer changes; and an agent given only the Naksha skill can answer "which token is the page background in dark mode" and "what does PromptInput do on Enter while composing".

### Step 1. Thin slice: Button and PromptInput

These two prove the whole pipeline, from source to bundle to preview to republish. Then I pause and you review.

- **Button and IconButton.** Five variants (primary, secondary, ghost, highlight, danger), three sizes, loading state (`aria-busy`, label kept for screen readers), icon slots, press scale 0.97 at 140ms that is skipped for keyboard presses and reduced motion. Previews show hover and pressed side by side using a preview-only `forceState` prop.
- **PromptInput.** TextArea that grows from 2 to 8 lines, Enter sends, Shift+Enter adds a line, send turns into stop while a reply streams, send disabled when empty. Enter must not send while an input method is still composing (`isComposing`), so Hindi and Marathi typing with an IME works. Attachments via drop and file picker (React Aria `DropZone`, `FileTrigger`) with upload progress, and a toolbar (`Toolbar`). Mentions and commands (`TokenField`) only once a product of yours needs them.
- **Every component README** from this step on uses one template: Usage, Best practices, Content, Accessibility (what Naksha provides, what designers decide, what developers must not break, a testing table for default, states, keyboard and screen reader), Release phase (Beta until 1.0), Change log. The Content section follows a word list and tone-by-situation rules that start in the brand book now.

Done when, for both: previews render from the bundle in both themes; screenshots match today's previews with no visible change (any difference gets reviewed, not waved through); axe reports zero serious or critical issues; keyboard tests pass; the artifact is republished.

Status: done in 0.2.2. The three previews render the live components and match the static screenshots within 4 pixels. Not yet: a manual screen reader pass (every README marks it "Not tested yet").

### Step 2. Form controls

Input, Textarea, Select, Checkbox, Radio, Switch, SegmentedControl. Shared Field parts for label, helper, error and character count, so every control lays out label to field, field to helper the same way.

Status: done in 0.2.3. The seven controls render live from the bundle, and the ⌘ ↵ ⇧ ⌫ glyphs are drawn icons. Every screenshot difference from 0.2.2 was reviewed and is listed in the changelog. SegmentedControl is built on React Aria's RadioGroup rather than ToggleButtonGroup: the toggle group moved focus on arrow keys but not the choice, and made every option a Tab stop, which is not how a radio group behaves. Not yet: a manual screen reader pass, and Select on real phones.

### Step 3. Overlays

DropdownMenu, Modal, Tooltip, Toast. Focus moves in on open and back on close, Escape closes, the page behind cannot be tabbed into. Because Toast is unstable upstream, it sits behind our own small API so an upstream change touches one file.

Status: done in 0.2.4. The four overlays render live, and PromptLevel opens its menu. Toast follows Emil Kowalski's write-up of Sonner (stack, spread on hover, transitions, swipe, pausing timers) on React Aria's toast region. Not yet: a manual screen reader pass, and the bottom sheet and swipe on real phones.

### Step 4. AI set

Scoped from React Spectrum's AI components and Primer's Copilot accessibility principles:

- Thread you move through by keyboard; a streaming reply is announced once, not word by word; the view stays at the newest message without stealing focus.
- User messages, replies, reasoning and generated content look and read differently.
- Response status that expands into a trace of steps (pending, failed, done), replacing the bare thinking dots.
- Numbered sources (SourceChip) and thumbs feedback on replies; SuggestionChip for starting prompts.
- Stop, retry and edit, so every AI action can be undone or redone.

Status: done in 0.2.5. Thread, ChatMessage (with Cite and Generated), ResponseStatus, SourceChip and SuggestionChip render live. Not yet: a manual screen reader pass, which matters most for this step: the announce-once behaviour and the thread keys need a real reader to confirm.

### Step 5. Everything else

Accordion (Disclosure), Alert, Avatar, Breadcrumb, Card, Divider (Separator), EmptyState, Kbd, Link, ProgressBar, Skeleton, Spinner, Table, Tabs, Tag (TagGroup), TopNav.

### Phase 1 is done when

- All 34 previews (33, plus ResponseStatus from step 4) and the cover render from the bundle, in both themes.
- Screenshots match the 0.2.0 previews, or every difference has been reviewed.
- axe: zero serious or critical issues across all previews.
- Every component has typed props in `index.d.ts`, a README with usage rules, and tests for keyboard use and states.
- CI is green and the artifact is republished. Version 0.3.0.

---

## Phases 2 to 8

Each gets a plan like the one above when the phase before it ends, written from what exists then, not from guesses now.

- **2. Components still missing.** The gap list from our earlier review is re-derived against the Phase 1 inventory, then scoped. Entry rule: a component joins when two of your products need it, or when it replaces one with evidence that it is better.
- **3. Charts.** Line, bar, area and the stat tile. Chart tokens: one colour per series (from the section colours), a neutral for labels and reference lines, and sequential ramps for ordered data. Contrast and colour-blind checks are part of the done-check.
- **4. Icon library.** Custom icons drawn for Naksha, about 310 in three tiers: core UI (about 150), product domains (about 110: money, legal and documents, AI and agents, privacy, publishing) and ones that are yours alone (about 50: section marks, architecture, making and writing, life). Official logos (about 12) are used as they are, never redrawn. It starts with a spec sheet (grid and safe area, standard outline shapes, stroke and corner rules, naming) and a tracker with a status per icon, before anything is drawn. Lucide on the same pen stays as the fallback, so no screen waits for an icon. The 30 most used get hand-tuned 16px versions; filled versions only where a selected state needs one (about 40). Drawn in batches of 20 to 30 by family, each checked at 16, 20 and 24 on paper and ink, beside its Lucide version, with a 5-second recognition test. Today's 40 (Lucide paths on the drafting pen) are replaced as their custom versions land.
- **5. Patterns.** Built only from the components, nothing new: forms, empty and error states, AI flows. Built outside-in (page frame and regions first) and shipped as copyable page templates. Content rules (word list, tone by situation) land in the brand book here at the latest.
- **6. Access and language.** Ship Noto Sans Devanagari (ADR 0005) after a visual pass with real Hindi and Marathi copy, and the en-IN formatter with the three-letter month fix (ADR 0006).
- **7. Brand assets.** To be scoped.
- **8. 1.0.** API frozen, versioned releases, docs complete.

## Decisions log

All in [`docs/adr`](adr). Closed on 17 Nov 2026: 0002 to 0006 and 0008. Open: fluid type (Phase 1, step 0).
