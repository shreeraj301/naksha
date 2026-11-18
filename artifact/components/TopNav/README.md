# TopNav

The site header from the portfolio: identity left, sectioned nav in the middle, a control on the right.

## Usage

```jsx
import { TopNav, SegmentedControl } from "naksha";

<TopNav
  name="Shreeraj Narwade"
  role="Product Designer / Design Engineer"
  items={[{ label: "Read", sub: "Work", href: "/read", section: "read", isCurrent: true }]}
  trailing={<SegmentedControl label="View" variant="quiet" options={views} />}
/>
<TopNav name="Shreeraj Narwade" items={items} isCompact={isPhone} hideOnScroll menuFooter={<Link href="mailto:...">Write to me</Link>} />
```

| Prop | Values | Default |
| --- | --- | --- |
| `name`, `role`, `homeHref` | identity on the left |  |
| `items` | `{ label, sub?, href, section, isCurrent? }[]`; `section` picks the colour square |  |
| `trailing` | a control on the right; on a phone it moves into the menu sheet | none |
| `isCompact` | the phone version: identity and a menu button that opens the menu sheet | `false` |
| `hideOnScroll` | steps aside while reading down, returns on the way up; makes the bar sticky | `false` |
| `menuFooter` | under the sections in the sheet: contact, résumé, social links | none |
| `isMenuOpen`, `onMenuChange` | control the sheet yourself; leave both out and TopNav manages it | |
| `onMenu` | deprecated since 0.3.1: with it, Naksha draws no sheet and the product opens its own | |

The bar returns near the top of the page (the first 120), on any scroll up of more than 4, whenever focus moves into it, and while the sheet is open. For sticky to work, render TopNav where its parent spans the whole page (directly in the app root, not inside a short wrapper).

## Best practices

- Six sections at most, each a colour from the section palette.
- Turn on `hideOnScroll` for pages people read top to bottom (case studies, articles). Leave it off for tools where the bar holds controls people reach for all the time.
- Switch to `isCompact` with the `bp-medium` media query (600), not by sniffing devices.

## Content

Labels are one word in mono caps; the line under says what the section holds.

## Anatomy and spacing

64 tall (`layout-nav-height`), side padding `layout-gutter` (16 when compact), hairline under. Each item is a 12 section square over a two-line `mono-label`.

The menu sheet fills the screen on `bg-canvas`. It repeats the bar, so Close sits exactly where the menu button was. Each section is a 16 square beside its label in Archivo Condensed 800 (32 to 44, fluid), the `mono-label` line under it, 16 above and below, and a hairline between. The current section gets a 2px ink rule. `trailing` and `menuFooter` follow, 24 apart; the footer sits at the bottom of the screen.

## States

The current page gets a 2px ink rule; hover draws the rule in `border-strong` from the left.

The sheet drops from the top in `dur-page` with `ease-in-out` and goes back up in `dur-overlay`; its sections fade down one after another, 40 apart. Hiding the bar slides it up in `dur-overlay`. With reduced motion nothing slides: the sheet and its sections fade, and the bar disappears and returns in place.

## Accessibility

**What Naksha provides.** A `<header>` with a named `nav` of real links; the current section has `aria-current="page"`. The phone menu button says whether the menu is open and that it opens a dialog. The sheet is a modal dialog named "Menu" (React Aria): focus moves in, Tab stays inside, the page behind cannot be reached or scrolled, Escape or Close shuts it, and focus returns to the menu button. Choosing a section closes it. A hidden bar comes back the moment focus moves into it, so keyboard focus is never behind the edge of the screen.

**What the designer decides.** The sections and their colours.

**What the developer must not break.** Set `isCurrent` on the section that holds the page.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Hover, current, compact (screenshots, forced colours) | Tested |
| Current page, menu state (component tests) | Tested |
| Sheet: opens, names itself, Escape and Close shut it, focus returns, sections close it (component tests) | Tested |
| Hide on scroll: down, up, near the top, focus inside (component tests) | Tested |
| Sheet on a real phone | Not tested yet |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.3.1 | The menu sheet the phone button opens, and `hideOnScroll`. `onMenuChange` replaces `onMenu`. |
| 0.3.0 | React component. |
| 0.2.0 | CSS component, v2 audit. |
