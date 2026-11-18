# Changelog

## Unreleased

### Fixed
- Menu items in Select and DropdownMenu: keyboard focus was only the 8% hover tint, 1.17:1 against the menu. A focused item now also has a 2px inset ring in the focus colour. A new test checks it reaches 3:1 in both themes.
- Site: with reduced motion on, React's page load failed on 43 of 51 pages (error #418), because Ask Naksha read the motion setting while rendering. The failure re-rendered the page from the server copy, which reset readers who chose light to dark. Ask now reads the setting after the page loads.
- Site: with reduced motion on, page titles were cut off on 40 pages. Reduced motion shortened every transition to 1ms, which still held the old width for a frame, so the title fitting measured the wrong size. Transitions are now off under reduced motion.
- Site: code blocks scroll sideways but couldn't take focus. Each one now takes Tab focus and shows the focus ring, so the arrow keys can scroll it.
- Slider: the track line was 2.48:1 against the page in light. It now uses `fg-subtle`: 4.56:1 in light, 7.17:1 in dark.
- Type sizes off the scale: 11px labels (redline dimensions, TopNav role and item notes, the prompt key hint, citation marks) are now 12; the Modal and Drawer title is 20 (`title-s`), not 22; the TopNav sheet footer is 13, not 14; a Generated block's serif body is 19 (`serif-body`), not 18.
- Stacking follows the tokens: overlays (Modal, Drawer, the full-size Image) sit at `z-overlay` (80, was 100) and toasts at `z-toast` (90, was 200).
- Preview pages had two landmarks with the same name: the Breadcrumb card's first trail is now "Breadcrumb, example", and the open TopNav menu's nav is "Sections, open menu".
- The site said 42 components; announce() is a function, so it is 41. One count, from `components.json`, is used everywhere.

### Added
- `npm run test:site` and a CI job: every site page in light and dark, with reduced motion on, against saved screenshots, plus checks for clipped text, console errors, a lost theme, axe at every severity, and reflow at 320px (ADR 0013). Issues that exist today are listed in `tests/site/known-issues.json` and can only be removed.
- `styles` on every component (ADR 0009 said so; 25 of 41 didn't take it): Accordion, Alert, Avatar, Breadcrumb, Card, ChatMessage and Generated, Divider, Drawer, DropdownMenu, EmptyState, Kbd, Link, ListItem, Modal, ProgressBar, ResponseStatus, Skeleton, SkipLink, SourceChip, Spinner, SuggestionChip, Table, Tabs, Tag and TagGroup, Toaster, Tooltip, TopNav. A test renders all 41 with `styles` and checks it lands.
- `forceState` on Accordion, Breadcrumb, DropdownMenu, SegmentedControl, Table, Tabs and TopNav, as `{ hover, focus }` naming the item to draw. `forceHover` and `forceFocus` still work, are marked deprecated, and go in 0.6.0.
- `navLabel` on TopNav, to name its sections nav when a page has more than one.
- Tokens: `dur-loop-pulse` (1500ms), `dur-loop-sweep` (1400ms), `dur-loop-blink` (1000ms) and `dur-loop-calm` (2000ms) for the loops that had raw times; the Spinner turns on `dur-hero` (900ms). `bg-code` and `fg-code` for code blocks, and `fg-on-section` for text on a section colour.
- Tests for EmptyState, Skeleton and Spinner. States sections in the PromptInput and Toast READMEs.

### Removed
- `radius-2`, `radius-4` and `radius-8`: reserved, never used. Corners stay square; a product softens them through `radius-control` and `radius-surface`.
- `z-dropdown`: never used. Popovers stack by DOM order, which keeps a Select's list above the Modal it sits in.

### Changed
- Lint: stylelint now rejects a raw z-index, a font size off the type scale, and a raw duration in `css/`, and checks the site's CSS for raw colours. ADR 0009 and 0010 say exactly what it enforces.
- The site's code blocks and section bands use tokens instead of raw hex. In dark, code blocks are a step lighter than the page (`stone-900`) instead of a darker colour that wasn't in the palette.

## 0.4.0 · Phase 2 done: SkipLink and announce()

The last pair of Phase 2. All eight components the products built by hand now come from Naksha.

### Added
- `SkipLink`: the first stop on the page. It waits just above the screen until Tab reaches it, then drops into the start corner; Enter moves focus to `<main id="main">` (giving it `tabindex="-1"` if it needs one, without a ring round the whole page), so the next Tab lands inside the content. It is a real link, so it works before scripts run.
- `announce(message, { interrupt })`: says a short message to screen readers without moving focus. One hidden pair of live regions per page, made on first use; each message is a new line, so repeats are read, and lines clear after 7 seconds. Polite unless `interrupt`.
- Cards for both: SkipLink in Navigation, announce in Feedback (its buttons speak, and the card shows what a screen reader hears).
- Drawer, announce and SkipLink join the forced-colours screenshot run.
- Tests: 4 component tests (99 in all).

### Changed
- The site uses Naksha's SkipLink. Its own skip link jumped to `#main` without moving focus there.
- The site's description counts its components from `components.json` instead of a number written by hand.
- Roadmap: Phase 2 is done, with what was checked and what was not.

## 0.3.5 · Image and ListItem

The third Phase 2 pair, each built by hand before in at least two of the products.

### Added
- `Image`: a picture in a frame that takes its `ratio` before the file arrives, so nothing below it moves. `bg-band` while it loads, a fade in when it arrives, and "Image did not load" if it fails. A hairline is drawn over the picture's edge. `srcSet` and `sizes` pick the right file for the screen; it loads when it nears the screen unless it has `priority`. An optional caption makes it a `<figure>`.
- `isZoomable` on Image: the frame becomes a button with a corner square, and opens the picture full size on a plain sheet, as large as fits and never past its own size. Escape, Close or a tap closes it, and focus returns to the picture.
- `List` and `ListItem`: rows between hairline rules, in Accordion's rhythm. A picture, a title, a line of facts, a sentence, something on the right, and actions. With `href` the content is one link and the actions stay outside it, so nothing interactive is nested.
- A `zoom-in` icon (41 in the set).
- Card previews can call a function the card defines for itself (`"$fn:name"` and a `<script data-nk-fn>`), in the artifact and on the site. Slider's card uses it to show a clock time, "1:23 of 3:40", in every state.
- Tests: 5 component tests (95 in all).

## 0.3.4 · Slider says a clock time, and fades like a field

Two gaps in 0.3.3's Slider, closed before the next pair.

### Added
- `formatValue` on Slider: a function that writes the value when a number format cannot, such as "1:23 of 3:40" for a seek bar. It is the text beside the label and what screen readers hear, and it wins over `formatOptions`.
- ADR 0012: a component drops from React Aria Components to React Aria's hooks only when the component layer cannot express something a person needs. `react-aria` 3.53.1 and `react-stately` 3.51.0 are now direct dependencies, at the versions React Aria Components 1.22.1 pins, and stay external in the ES module build.

### Changed
- Slider is built on React Aria's slider hooks instead of its Slider component. It looks and behaves the same; the markup now carries its own state attributes.
- A disabled Slider's label fades like every other disabled field. Its `<label>` now points at the input, so accessibility checks treat it as part of a disabled control. The value stays muted and readable.
- The site resolves `react-aria` and `react-stately` from its own folder, like `react-aria-components`.
- Tests: 2 component tests for the clock time and the label (90 in all).

## 0.3.3 · Slider and Drawer

The second Phase 2 pair, each built by hand before in two of the products.

### Added
- `Slider`: one value from a range, on React Aria's Slider. A real range input inside a 16 square ink thumb on a 2px line, with an ink fill up to the thumb. The value beside the label and the value screen readers hear both come from `formatOptions`, so the unit is said aloud. `onChangeEnd` fires once at the end of a drag or key press. The hit area is 24 tall, 44 under touch.
- `Drawer` and `DrawerTrigger`: Modal's dialog as a 400 wide panel on the `end` (or `start`) edge, for a short task or a list of links. The body scrolls between a fixed head and foot. It slides in while only the scrim fades, so the page never shows through the panel; under reduced motion it fades. Full width below 600. Click outside closes it only with `isDismissable`.
- Cards for Slider (Forms) and Drawer (Surfaces). Slider joins the forced-colours screenshot run.
- Tests: 6 component tests (88 in all).

### Known limits
- A slider's value is written with `Intl.NumberFormat`, so a clock time like "1:23" cannot be written or spoken yet. Use seconds or minutes as a unit.

## 0.3.2 · Phase 2 starts: ToggleButton and CopyButton

The first two components from the Phase 2 scope, each built by hand before in at least two of the products.

### Added
- `ToggleButton`: one button that stays pressed (`aria-pressed`), on React Aria's ToggleButton. Off it is a secondary Button or IconButton; on it fills with ink. Disabled and on keeps a faded fill, so the state still reads. The name never changes with the state.
- `CopyButton`: copies a value (or a value built at the moment of the press), shows "Copied" with a check for two seconds without changing width, and announces it politely. If the browser refuses the clipboard, a labelled read-only field appears with the text selected and focused.
- Cards for both in the Actions group, and both in the forced-colours screenshot run.
- Tests: 7 component tests (82 in all).

## 0.3.1 · TopNav on phones, and fluid type written down

### Added
- TopNav's menu sheet. On a phone (`isCompact`) the menu button opens a full-screen sheet of the same sections, dropping from the top the way the portfolio menu does. It repeats the bar, so Close sits where the menu button was. Sections are large condensed labels with their colour squares; `trailing` and the new `menuFooter` follow. It is a React Aria modal dialog named "Menu": focus moves in and stays in, the page behind cannot be reached or scrolled, Escape or Close shuts it, focus returns to the button, and choosing a section closes it. With reduced motion it fades instead of sliding.
- `hideOnScroll` on TopNav: the bar steps aside while reading down and returns on the way up, near the top of the page, whenever focus moves into it, and while the sheet is open. It makes the bar sticky.
- `isMenuOpen` with `onMenuChange` to control the sheet; leave both out and TopNav manages it.
- ADR 0011: display type is fluid, reading type is not. It records what 0.2.1 did and closes the last open decision.
- Tests: 4 component tests for the sheet and hide on scroll (75 in all).

### Changed
- TopNav's preview card shows the phone bar closed and with the menu open, so it is taller (940).

### Deprecated
- TopNav `onMenu`. With it, Naksha draws no sheet and the product opens its own, as before. Use `onMenuChange`.

## 0.3.0 · Phase 1 done: every component is live

Phase 1, step 5: the last sixteen components are React components, so all 34 previews in the artifact render from `bundle.js`. Their previews match the 0.2.5 screenshots within 4 pixels.

### Added
- `Accordion`, `Alert`, `Avatar`, `Breadcrumb`, `Card`, `Divider`, `EmptyState`, `Kbd`, `Link`, `ProgressBar`, `Skeleton`, `Table`, `Tabs`, `Tag` and `TagGroup`, and `TopNav`, in `naksha` and `window.Naksha`. React Aria underneath where a component has behaviour: DisclosureGroup, Breadcrumbs, Link, ProgressBar, Separator, Tabs and TagGroup.
- Accordion titles are headings with buttons; a closed panel takes no space but stays findable with the browser's find.
- Alert: `role="alert"` for danger only, `role="status"` for the rest.
- Avatar with a name is a named image ("garu, AI" for agents); without one it is hidden.
- Kbd is a real `<kbd>`, with drawn, named keys.
- TagGroup: removable tags you move through with arrow keys; Delete removes the focused one.
- Tests: 13 component tests for the sixteen.

### Changed
- Spinner `size` is `sm`, `md` and `lg` (16, 24, 32); `md` is the default. Before, `lg` drew 24.
- TopNav's phone menu button is full ink, as the static preview had it.
- The artifact bundle grows from about 394 KB to 460 KB minified.

## 0.2.5 · Phase 1, step 4: the AI set

Thread, ChatMessage, ResponseStatus, SourceChip and SuggestionChip are live React components. ChatMessage and SourceChip match the 0.2.4 screenshots within 4 pixels; ResponseStatus is a new card.

### Added
- `Thread`, `ChatMessage`, `Cite`, `Generated`, `ResponseStatus`, `SourceChip` and `SuggestionChip` in `naksha` and `window.Naksha`.
- Thread: a `feed` of named, numbered messages with one Tab stop; arrow keys, Page Up, Page Down, Home and End move between them. While a reply streams the feed is busy; when it finishes it is announced once. The view follows the newest message only while you are at the end, and focus never moves on its own.
- ResponseStatus: a trace of steps (pending, running, done, failed) behind a mono toggle ("2 of 5 steps, 1 failed"), replacing the bare thinking dots. Each step says its state in words for screen readers. While a reply streams, its running step names the status beside the agent.
- ChatMessage: sources and actions wait until a reply is done; thumbs say whether they are pressed and keep an ink edge; Try again on failed and finished replies; Edit on a person's turn.
- Generated: content the agent made for the person to use, in a hairline box in the reading face, with its own copy.
- SourceChip is read as "Source 1: Schedule A, clause 4.2", and can be a link.
- Tests: 10 component tests and 2 live browser tests (Chrome's names for sources, moving through the thread, following the newest message without moving focus).

### Changed
- A disabled SuggestionChip greys its arrow too.
- A keyboard press no longer scales a SuggestionChip, as with Button.
- The artifact bundle grows from about 385 KB to 394 KB minified.

## 0.2.4 · Phase 1, step 3: overlays

DropdownMenu, Modal, Tooltip and Toast are live React components. Their previews render from `bundle.js`; DropdownMenu, Modal and PromptInput match the 0.2.3 screenshots within 4 pixels, and the two differences are listed under Changed.

### Added
- `DropdownMenu`, `Modal` with `ModalTrigger`, `Tooltip`, and `toast()` with `<Toaster />` (also exported as `Toast`), built on React Aria Components 1.22.1.
- Focus for every overlay: it moves in on open, Escape closes, and it returns to the trigger. A modal keeps Tab inside and hides the page behind from screen readers.
- Toast follows Emil Kowalski's write-up of Sonner: a stack where each toast behind peeks 8 above and is 5% smaller, spread 8 apart on hover or focus, transitions that retarget mid-flight, swipe down to dismiss (40, or a flick faster than 0.11 px per ms), and timers that wait while the stack is hovered or focused and while the tab is hidden. It sits on React Aria's toast region behind Naksha's own small API, because React Aria still marks that region unstable.
- Popover, tooltip and modal motion: scale from 0.97 with opacity in, fade out; only a fade under reduced motion. Below 600 wide a modal is a bottom sheet.
- Tests: 11 component tests (menu keyboard and focus return, PromptLevel, modal focus and Escape, tooltip, toast timers, actions and dismiss) and 6 live browser tests (menu, modal, tooltip position, toast stack with spread and timers, swipe, reduced motion).

### Changed
- PromptLevel takes `options`, `value` and `onChange` and opens a menu of choices. Its accessible name says the current choice ("Reading level: Everyday"). `children` with `onPress` still works for a plain trigger.
- Select's list uses the same pop-in as the other popovers.
- The Tooltip preview's "In place" cell shows a real tooltip over its button, so the button sits at the left of its cell instead of centred under the bubble.
- The Toast preview adds the collapsed stack under the list.
- Tooltip enters over 150ms (`dur-hover`) instead of 125, so it uses a token.
- The artifact bundle grows from 336 KB to about 385 KB minified.

## 0.2.3 · Phase 1, step 2: form controls

The seven form controls are live React components. In the artifact, the Input, Textarea, Select, Checkbox, Radio, Switch and SegmentedControl previews render them from `bundle.js`. Checkbox, Switch and SegmentedControl match the 0.2.2 screenshots within 4 pixels; every other difference is listed under Changed and was reviewed.

### Added
- `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup` and `Radio`, `Switch` and `SegmentedControl` in `naksha` and `window.Naksha`, built on React Aria Components 1.22.1.
- Shared field parts: one label, one help line, one error. While an error shows, the help hides, so a person reads one message at a time. Label to field 8, field to help 6, for every field.
- Textarea grows with its text from 120 (about five lines) to 360 (sixteen), then scrolls. It has no drag handle any more.
- Textarea: a character count ("0 / 6,000", `en-IN` grouping) joined to the field's description, and a live region that speaks twice at most: on entering the last 10% and at the limit.
- Two icons, `arrow-big-up` (⇧) and `delete` (⌫), from Lucide 1.67.0 on the drafting pen. The set is 40.
- Tests: 15 more component tests (labels and descriptions, errors, typing, Select keyboard and type-to-select, checkbox and switch keys, radio and segmented arrow keys), live browser tests for the Select popover, Textarea growth and the focus ring on drawn boxes, and a forced-colours screenshot for Textarea.

### Changed
- ⌘ ↵ ⇧ ⌫ are drawn icons, each named for screen readers, in Kbd, Tooltip, DropdownMenu, the IconButton preview and the PromptInput key hint. No Naksha font has these glyphs, so readers saw a system fallback before. Inside a key the icon is 1em with a 2 stroke (1px at 12px).
- Checkbox, Radio and Switch draw their box or track as a span beside React Aria's hidden input, styled from React Aria's data attributes. They look the same.
- SegmentedControl is a React Aria RadioGroup: one Tab stop on the chosen option, and arrow keys move the choice.
- A Select placeholder ("Choose a level") is now in the placeholder colour. In 0.2.2 it looked like a chosen value.
- The help line of a disabled field stays `fg-muted`, because it says why the field is locked. It used `fg-disabled` (2.0:1).
- Windows High Contrast: a focused field, Select trigger or PromptInput box shows a 2px Highlight edge. Forced colours remove the box-shadow the normal focus edge uses, so focus was invisible there before. Disabled fields now show their text in GrayText.
- Single radios in the Radio preview's matrix sit 2px tighter: the group no longer adds a line of text height around each one.
- The Textarea preview count reads 123: the sample text has 123 characters, not the 124 the static preview showed.
- The artifact bundle grows from about 184 KB to 336 KB minified (86 KB gzipped).

## 0.2.2 · Phase 1, step 1: Button and PromptInput

The first live components. In the artifact, the Button, IconButton and PromptInput previews now render the real React components from `bundle.js`, and their screenshots match the static 0.2.1 previews within 4 pixels.

### Added
- `Button`, `IconButton`, `PromptInput`, `PromptLevel`, `Icon` and `Spinner` in `naksha` and `window.Naksha`, built on React Aria Components 1.22.1.
- Button: five variants, three sizes, icon names or nodes on either side, pending state (React Aria keeps it focusable and announces it), layout-only `styles`.
- PromptInput: grows from two to eight lines then scrolls; Enter sends, Shift+Enter adds a line, Enter never sends while an IME is composing; Send becomes Stop while generating; attach by file picker or by dropping on the box; file chips with named remove buttons; a slot beside Send for steering.
- `Icon` renders Naksha's 38 drawn icons by name; `src/icons.generated.ts` is generated from `artifact/assets/Icons`.
- Tests: 15 component tests in jsdom, and browser tests on the live previews for press scale, autosize and IME composition.
- Component READMEs for Button, IconButton and PromptInput follow the new template, with an accessibility testing table.

### Changed
- A keyboard press no longer scales a button; only pointer presses do. Under reduced motion nothing scales (this rule lost to a more specific selector before, and now wins).
- The spinner inside a button is heavier (2px at 16px) and its arc covers a third of the ring, so it reads on filled buttons. Standalone spinners are unchanged.
- The artifact bundle grows from 1.4 KB to about 184 KB minified, almost all of it React Aria.

## 0.2.1 · Phase 1, step 0

Groundwork for React components. Nothing in the artifact previews changes: all 68 (34 components, light and dark) match the 0.2.0 screenshots within 4 pixels.

### Added
- Tooling: TypeScript, esbuild, Vitest, Playwright screenshot tests with axe on every preview, all pinned to releases at least two weeks old.
- Artifact plumbing: `components/bundle.js` (one classic script, `window.Naksha`), `components/index.d.ts`, React 18.3.1 in `components/lib`. Namespace `Naksha`.
- `layoutStyle()` and the `LayoutStyles` type: components will accept layout overrides only (ADR 0009).
- Windows High Contrast support. Radio dots, switch thumbs, selected segments, tab and nav underlines, progress bars, menu highlights and skeletons now show in forced colours. Fifteen components have forced-colour screenshots.
- The Naksha Agent Skill (`skills/naksha`) and `naksha init-agents`, which writes a marked rules block into a product's AGENTS.md and CLAUDE.md.
- ADRs 0009 (layout-only overrides) and 0010 (CSS architecture).

### Changed
- `naksha.css` and `components.css` sit in cascade layers (`naksha.tokens`, `naksha.base`, `naksha.components`).
- Spacing, sizes and type are written in rem in `naksha.css`, and every length above 2px in `components.css` is rem. Token names are unchanged. The artifact keeps px.
- Display styles and `title-m` are fluid in `naksha.css`, copied from the portfolio's clamps; `title-l` steps to 28px below 600px.
- Reduced motion: nothing moves, but colour and opacity changes keep their timing (was: every transition at 1ms).
- Class prefix `sn-` is now `nk-`.
- PromptInput's README states that Enter never sends while an input method is composing.

## 0.2.0 · Decisions closed

### Changed
- Breakpoints now come from the portfolio's own media queries, measured in the browser: 600, 900, 1200, 1440 (were 600, 840, 1200, 1600 from Material 3). ADR 0004.
- `layout-gutter`, `layout-unit` and `layout-section` are fluid in `naksha.css`, copying the portfolio's clamps exactly. The mobile media-query override is gone. The artifact shows the largest size.
- `display-xl` is 100px at its largest, matching the portfolio `--t-xl` (was 96px, with no recorded reason).
- The cover reads Naksha, with the tagline "A design system for my products."

### Decided
- ADRs 0002 to 0006 accepted. ADR 0008 records why `fg-subtle` keeps its value and stays off `bg-subtle`.
- Dates and numbers checked again in Chrome 156: "Sept" also appears there, and compact numbers read 1.3Cr.

### Added
- `docs/ROADMAP.md`, with the Phase 1 plan.

## 0.1.0 · Phase 0

The design system moves from a Python script inside the artifact to its own repo.

### Added
- Token source in W3C DTCG 2025.10 with a resolver for light and dark (ADR 0002).
- Build with no dependencies: CSS, JS with types, the Claude artifact format.
- Breakpoint tokens `bp.medium`, `bp.expanded`, `bp.large`, `bp.xlarge`, and mobile layout values below 600px (ADR 0004).
- `font.devanagari` and `weight.*` tokens.
- Dark theme follows `prefers-color-scheme` when no `data-theme` is set.
- Tests: aliases, DTCG shapes, contrast in both themes, one change reaching every output.
- Lint: no raw colours or pixel spacing above 2px in `css/`.
- ADRs 0001 to 0007, licences for code and fonts.

### Changed
- Every v2 value and usage note carries over unchanged. Checked by diffing the generated artifact against v2.
- `fg-subtle` now says it is not for `bg-subtle` (4.07:1 in light). No component used that pair; a test keeps it that way.
- Four spacing nudges in `components.css` now use tokens (alert close button, accordion indent, message error icon). The thinking dots keep a 3px gap on purpose, with a note.
- The artifact's source (component previews, their READMEs, the brand book, icons, the index) now lives in `artifact/`. The build combines it with the generated tokens into `dist/artifact/`.
- Figma is out of scope (ADR 0007). No Figma output.

## v2.0 · 17 Nov 2026 · the Shreeraj audit

v1 (the Figma build) was checked against the five council lenses (Ive, Rams, Hadid, Ingels, Norman), Emil Kowalski's design-engineering rules and the Awwwards jury weights (design 40, usability 30, creativity 20, content 10). Every component was rendered in both themes, measured, and run through axe-core.

### Scores (self-assessed, 1 to 5)

| Lens | v1 | v2 | What moved it |
| --- | --- | --- | --- |
| Ive · material truth | 3 | 4.5 | Real Archivo at width 62 for display; icons redrawn with square caps to match square edges |
| Rams · economy | 3 | 4 | 16 text styles to 15 named roles; repeated state captions removed; one focus method |
| Hadid · flow | 3 | 4 | Clear sheet order; optical alignment so edges line up across components |
| Ingels · delight | 2.5 | 4 | Spec redlines drawn in terracotta on key components; highlighter selection; registration-cross cover |
| Norman · clarity | 3.5 | 4.5 | Composer rebuilt; Stop while streaming; trust line; loading state on buttons |

### Findings and fixes

| Before (v1) | After (v2) | Why |
| --- | --- | --- |
| Display set in Archivo Narrow Bold as a stand-in | Archivo Condensed: Archivo pinned to width 62, weight axis kept | Matches the portfolio hero exactly, and installs in Figma for the export |
| Lucide icons with round caps and joins | Square caps, mitred joins, 1.5 stroke | Round terminals fought the square system; a drafting pen draws square ends |
| Two focus methods (shadow effect on filled controls, outline layer on transparent ones) | One 2px ink outline, 2px offset; fields double their own edge | One rule to learn; works on transparent and filled controls alike |
| Prompt input: 12/16 padding, 19px text, 40px controls, a full bordered segmented control, no Stop | 8 padding, 15px text, all controls 32, quiet reading-level trigger, Stop while streaming, trust line and key hints | Text and icon glyphs now share one 16px edge; the main action is the only filled thing |
| Danger hover jumped from terracotta 700 to 900 (brown) | New terracotta-800 for hover, 900 for pressed | One step darker reads as a response, not a different colour |
| Highlight and danger had no pressed colour | `action-highlight-pressed`, `action-danger-pressed` | Every pressable fill answers the press |
| Buttons had no loading state | Spinner replaces the leading icon, label and width stay, `aria-busy` | A width jump during save reads as a glitch |
| Pressed was a colour only | Scale 0.97 over 140ms on `ease-out` (0.94 on icon buttons) | The control should feel like it heard you |
| Motion table put menus at 450ms and modals at 600ms | `dur-hover` 150, `dur-ui` 200, `dur-overlay` 280; page steps kept for pages | UI animation over 300ms feels slow |
| Mono labels at 0 tracking | +4% tracking on 12px caps | Small capitals need air to stay legible |
| Body text 19px in UI | `body-m` 15 for UI, `body-l` 17 for reading | 19 was a headline size inside controls |
| Field focus: ink edge plus an outer ring | Edge doubles to 2px ink | A box you type into shows focus on itself |
| Card media inset 12 inside the card | Media flush, hairline under it, footer row with the link | Reads as a sheet with a title block, not a card with a picture in it |
| User chat turn had an avatar | No avatar, right-aligned `bg-subtle` block | The agent needs identity; the person does not |
| Selected table rows dropped muted text to 4.3:1 | Muted text turns `fg-default` in a selected row | Found by axe-core |
| Progress bars without names; menu radios without `aria-checked` | Named, and every radio item carries `aria-checked` | Found by axe-core |
| Spacing tokens named by step (`space/4` = 16) | Named by pixel value (`space-16` = 16) | Removes a lookup every time |

### Added
Kbd, Breadcrumb, loading state on Button, attachment chip and trust line on PromptInput, Thinking state on ChatMessage, removable Tag, a determinate and an indeterminate ProgressBar, `selection`, `spec-redline`, `z-*`, `dur-*` and `ease-*` tokens.

### Still open
- Date picker, pagination, combobox with search, slider, file upload and chart tokens are not built yet.
- The Figma file still holds v1. Re-export from this system: tokens, the Archivo Condensed font, then components.
- Code Connect needs the portfolio-v1 repo.

## v1.0 · 17 Nov 2026
First build in Figma: variables (Primitives, Color, Spacing, Layout, Typography), 16 text styles, 2 effects, 43 components and 35 icons.
