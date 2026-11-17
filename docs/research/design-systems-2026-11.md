# What eleven design systems teach Naksha

Research done 17 Nov 2026, before Phase 1, step 0. Pages were read in Chrome. Package facts come from npm, and Astryx facts from its own CLI (0.7.16). Every claim below links to where it was checked. Raw notes, with a source on every line, are in [`notes-2026-11.md`](notes-2026-11.md).

The question was not "what do they have that we don't" but "what makes them good, and which of those things change what Naksha should build next".

## What the best systems have in common

1. **They are written for agents as well as people.** React Spectrum serves every page as markdown, has an `llms.txt`, an MCP server and an installable skill. Astryx puts its whole documentation behind a CLI and writes a managed block into a project's `AGENTS.md` or `CLAUDE.md`. Razorpay's Blade has moved its MCP server into maintenance mode and now ships the same docs as an Agent Skill. Polaris pages carry "Copy MD" and an AI toolkit. This is no longer a nice extra.
2. **They protect the look through the API, not through review.** React Spectrum's components accept overrides for layout only (margin, width, grid placement, position). Colour and inner padding cannot be changed. Drift is impossible rather than discouraged.
3. **They prove accessibility per component, per version.** Carbon publishes a testing table on every component (default state, other states, keyboard, screen reader, each marked tested or manually tested) against a named release.
4. **They respect the user's settings.** Astryx writes spacing in rem so it grows with the browser's font size. Fluent and Atlassian ship high-contrast themes, and React Spectrum's styling treats forced colours as an ordinary condition.
5. **Their AI guidance is about trust, not decoration.** Primer's Copilot principles ask that people always know who is speaking, what the AI is doing and why, and how to undo it. React Spectrum's AI components turn that into parts: a status line that expands into a trace of steps, numbered sources, feedback, and a thread you can move through by keyboard.
6. **Every page has the same shape.** Apple's HIG pages all run Getting started, Best practices, Platform considerations, Resources, Change log. You learn the template once.
7. **They say how mature each part is.** Atlassian labels everything Early Access, Beta or General Availability, with two named deprecation steps.

## System by system

| System | Tokens | Themes | Agent-readable | Accessibility evidence | Takeaway for Naksha |
| --- | --- | --- | --- | --- | --- |
| React Spectrum S2 (Adobe) | Style macro over tokens, atomic CSS, cascade layers | Light, dark, forced colours | .md per page, llms.txt, MCP, Agent Skill | React Aria behaviour, test utils (RC) | Layout-only overrides, layers, forced colours, the AI component anatomy |
| Astryx (Meta) | Semantic, rem spacing, light-dark(), theme knobs (radius multiplier, motion tempo and character) | 7 themes, dark | CLI docs, AGENTS.md block, global skill, MCP | Evidence-based review: good / needs work / not inspected | rem, agent block, review rubric, outside-in layout |
| Material 3 (Google) | Reference, system, component tiers | Not checked | Not checked | Not checked | Component tier rejected for now; motion schemes named |
| Apple HIG | Not checked | Not checked | Not checked | Not checked | One page template with a dated change log; voice and tone; word list |
| Polaris (Shopify) | `@shopify/polaris-tokens` package | Not checked; one framework across admin, checkout, accounts, POS | Copy MD, AI toolkit | Not checked | Moved to web components; plain-language rules |
| Carbon (IBM) | Not checked | Not checked | Not checked | Per-component testing table per version | Publish a testing table per component |
| Primer (GitHub) | Not checked | Not checked | Not checked | Annotation toolkit, Copilot principles | AI trust principles |
| Atlassian | foundation.property.modifier | Light, dark, high contrast, density, reduced motion | Not checked | Not checked | Release phases; tokens picked by meaning |
| Fluent 2 (Microsoft) | Global and alias | Light, dark, high contrast, brand | Not checked | Contrast built into tokens | Confirms Naksha's two tiers |
| GOV.UK | Not checked | Not checked | Not checked | Research with disabled users before publishing | Criteria before something enters the system |
| Razorpay Blade | Not checked; one package for web and React Native | Not checked | Skill (MCP in maintenance) | Not checked | Indian formats through Intl; skill over MCP |

"Not checked" means I did not look, not that the system lacks it.

## Changes for Naksha, ranked

Ranked by how much each one changes the quality of what Phase 1 produces. Each is tagged with when it happens.

### Before or during Phase 1, step 0

1. **A Naksha skill and agent block.** Generate an Agent Skill (`skills/naksha/SKILL.md`, in the agentskills.io format Spectrum and Blade use) from the tokens, the brand book and each component README, plus a marked block for a project's `AGENTS.md` / `CLAUDE.md`, refreshed by the build. No MCP server: Blade's move from MCP to a skill is the clearest signal of where this is going. *Why first:* you build with Claude daily, and every later phase is built faster and more correctly when the agent reads Naksha instead of guessing. Evidence: [Spectrum AI](https://react-spectrum.adobe.com/ai), Astryx `docs working-with-ai`, [Blade MCP readme](https://www.npmjs.com/package/@razorpay/blade-mcp).
2. **Layout-only overrides on components.** Components take a `styles` prop typed to margin, width, flex and grid placement, position and z-index. No `className` reaching visual parts. *Why:* it makes drift impossible, the same reason Spectrum does it. Evidence: [Spectrum styling](https://react-spectrum.adobe.com/styling).
3. **Cascade layers.** `naksha.css` and `components.css` go into `@layer naksha.tokens, naksha.base, naksha.components`. A consumer's CSS then wins predictably, and a CSS reset can be placed below. Evidence: [Spectrum styling](https://react-spectrum.adobe.com/styling).
4. **rem output for spacing, sizes and type.** Names stay (`space-16` is still 16px at the default size). A reader who sets a larger browser font gets larger gaps and controls, not just larger text. Previews look identical at the default 16px root, which the screenshot tests will prove. Evidence: Astryx `docs spacing`; Carbon notes low-vision users "may have their browser font size adjusted to a larger setting".
5. **Forced colours (Windows High Contrast).** `components.css` has none today. Every control gets a `forced-colors` rule using system colours so borders, focus and selection stay visible. Evidence: Spectrum's style macro treats `forcedColors` as a normal condition; Fluent and Atlassian ship high-contrast themes.
6. **Release phase on every component.** Each component README states Beta, Stable, Intent to deprecate or Deprecated. Phase 1 components start as Beta and become Stable at 1.0. Evidence: [Atlassian release phases](https://atlassian.design/release-phases).
7. **An evidence rule for reviews.** Every finding cites a file and line, a rendered state or a source; categories are good, needs work, not inspected; missing evidence is never a pass. Merged into the-shreeraj-audit and the Naksha skill. Evidence: Astryx `docs is-my-code-good`.

### Phase 1, steps 1 to 5

8. **AI set scope, from React Spectrum's anatomy and Primer's principles.** PromptInput and the AI set cover:
   - a response status that expands into a trace of steps (pending, failed, done);
   - user messages, AI replies, AI reasoning and generated content that look and read differently;
   - numbered sources and thumbs feedback on replies;
   - a thread you can move through by keyboard, a streaming reply announced once, and a view that stays at the newest message without stealing focus;
   - stop, retry and edit, so every AI action can be undone or redone;
   - attachments with upload progress; mentions and commands only if a product of yours needs them.

   Built on React Aria parts that already exist in 1.22.1 (`TokenField`, `DropZone`, `FileTrigger`, `Toolbar`, `Virtualizer`), not on Adobe's styled package. Evidence: [Spectrum AI components](https://react-spectrum.adobe.com/ai-components), [Primer Copilot principles](https://primer.style/accessibility/foundations/copilot-principles/).
9. **One README template for every component.** Usage; Best practices (do and don't); Content; Accessibility (what Naksha provides, what the designer must decide, what the developer must not break, and a testing table: default, states, keyboard, screen reader, each tested, manually tested or not tested yet); Release phase; Change log. Evidence: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/writing), [Carbon Button accessibility](https://carbondesignsystem.com/components/button/accessibility/).
10. **Content rules in the brand book.** A word list (one term per concept, no synonyms), tone by situation (error, empty, success, AI), buttons that start with a verb, no idioms, plain language. Evidence: [Shopify content](https://shopify.dev/docs/apps/design/content), Apple HIG writing.
11. **Reduced motion, reconsidered.** Today every transition drops to 1ms. Astryx caps durations at 200ms instead, which keeps state changes readable. Decide in step 0: remove movement (slides, scale) but keep short fades. Evidence: Astryx `docs tokens` (tokens-duration).

### Later phases

12. **Phase 2: an entry rule for new components.** A component enters Naksha when two of your products need it, or when it replaces one with evidence that it is better. Adapted from GOV.UK's useful, unique, usable, consistent, versatile. Evidence: [GOV.UK contribution criteria](https://design-system.service.gov.uk/community/contribution-criteria/).
13. **Phase 3: chart tokens.** One colour per series, a neutral for labels and reference lines, sequential ramps for ordered data. Evidence: Astryx `docs tokens` (tokens-data).
14. **Phase 5: outside-in layout and templates.** Decide the page frame and region budgets first, then content; dense data as rows, not cards; ship patterns as copyable page templates. Evidence: Astryx `docs layout`, `docs principles`.
15. **Phase 6: accessibility by people.** Organise the accessibility guide around people (blind, low vision, colour-blind, deaf, physical, cognitive), as Carbon does. Evidence: [Carbon accessibility](https://carbondesignsystem.com/guidelines/accessibility/overview/).

### Considered and rejected

- **A component token tier** (Material 3's `md.comp.*`). Naksha has 33 components and one owner; a third tier adds names without adding decisions. Revisit at 1.0.
- **A build-time style macro or atomic CSS** (React Spectrum). The artifact needs one classic script and Naksha is CSS-first. Not worth the toolchain.
- **Web components** (Polaris's move). Your portfolio runs on Astro, so framework-agnostic matters, but the CSS layer already works anywhere. React components on top of it are enough for now.
- **Spring physics for motion** (Material 3 Expressive). Naksha's motion is deliberately calm, with no overshoot. Its scheme gets a name, "standard", so the choice is explicit.
- **Density themes** (Atlassian). No product of yours needs compact mode yet.

## About the astryx skill

Checked against Astryx 0.7.16 on 17 Nov 2026. Its facts hold: 174 components, 7 themes, 58 page and 726 block templates, React 19+, and the CLI path. It is missing the experimental theme editor (`experimental theme editor new <name> --like neutral`, `editor set`, `editor how`, `editor show --png`), whose docs say a theme change is not done until you have looked at it, and the `swizzle`, `discover` and `manifest` commands. Edits are proposed separately.
