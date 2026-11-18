# SkipLink

The first stop on the page for keyboard users: hidden until Tab reaches it, then one press moves focus past the navigation to the main content.

## Usage

```jsx
import { SkipLink, TopNav } from "naksha";

<body>
  <SkipLink />
  <TopNav … />
  <main id="main">…</main>
</body>
```

| Prop | Values | Default |
| --- | --- | --- |
| `target` | the id of the main content | `"main"` |
| `children` | what it says | `"Skip to content"` |

## Best practices

- One per page, first in `<body>`, before the TopNav. It only helps if it is the first thing Tab reaches.
- Point it at the page's one `<main>`. Give that `<main>` the id, nothing else.
- Keep "Skip to content". People who use it know the words; a clever label makes them stop and read.

| Do | Don't |
| --- | --- |
| `<SkipLink />` first, then the nav | A skip link after the nav |
| `<main id="main">` | `id="main"` on a wrapper that holds the nav too |

## Content

"Skip to content", in sentence case. Change it only when the page's main part has a plainer name, such as "Skip to results".

## Anatomy and spacing

48 tall (`size-control-lg`), 16 at the sides, label 15, weight 500, in `action-on-primary` on an `action-primary` fill, corners 0. Fixed 16 from the top and the start edge, above the nav (`z-toast`). Until it has focus it waits just above the screen.

## States

Focus brings it down into its corner over 200ms (`dur-ui`, `ease-out`) with the system outline 2 off its edge; leaving it sends it back up. Under reduced motion it appears and goes without sliding. Enter moves focus to the target and scrolls it into view. The target takes focus without the ring the browser would draw round the whole page. In Windows High Contrast it keeps its edge and the outline.

## Accessibility

**What Naksha provides.** A real link to `#main`, so it works before scripts run. With scripts it moves focus itself: a `<main>` cannot take focus on its own, so Naksha gives it `tabindex="-1"` (unless it has one) and focuses it, and the next Tab goes to the first control inside. Screen readers hear "Skip to content, link".

**What the designer decides.** Nothing per page, except a better name for an unusual main part.

**What the developer must not break.** Keep it first in the page, and keep the id on `<main>`. Do not hide it with `display: none`: Tab skips what is not displayed.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light, dark and forced colours) | Tested |
| First Tab stop, Enter moves focus to `<main>`, next Tab lands inside, own target and words (component tests) | Tested |
| Hidden above the screen, shown on Tab, scroll to main (live browser) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.4.0 | New. Built by hand before in Ledger (`SkipLink`, which also moves focus with script), the portfolio (`Base.astro`) and this site, which now uses it. |
