# announce

Says a short message to screen readers without moving focus or showing anything on screen.

## Usage

```jsx
import { announce, Button } from "naksha";

<Button onPress={() => { save(); announce("Draft saved."); }}>Save draft</Button>

announce("Could not send. Check your connection and try again.", { interrupt: true });
```

| Argument | Values | Default |
| --- | --- | --- |
| `message` | what to say, as a sentence | |
| `options.interrupt` | read it at once, cutting off what is being read | `false` |

## Best practices

- Use it when something changes that a sighted person would notice and a screen reader user would not: a save that finished, a filter that left 3 results, a room you walked into.
- If the change is already on screen as text in a Toast or an Alert, those speak for themselves. Do not announce it twice.
- Keep `interrupt` for errors that stop the person. Everything else waits for a pause in what is being read.
- Announce the result, not the action: "Draft saved.", not "Saving".

| Do | Don't |
| --- | --- |
| "3 results." after a filter | "The results have been updated" |
| `interrupt` for "Could not send." | `interrupt` for "Draft saved." |

## Content

One short sentence with a full stop, plain words, numbers as digits. Say what happened and, for an error, what to do next.

## Anatomy and spacing

Nothing on screen. Naksha adds one hidden pair of live regions to the page the first time it is called: one polite, one that interrupts. Each message is added as a new line, so the same words said twice are read twice, and each line is removed after 7 seconds.

## States

The first message on a page waits 0.1 seconds, because Safari misses text added to a live region in the same moment the region appears. Later messages go at once. On the server it does nothing.

## Accessibility

**What Naksha provides.** Live regions with `role="log"` and `aria-live`, visually hidden with inline styles, so they work even before Naksha's stylesheet loads. Focus never moves. It is the same approach as React Aria's own announcer, written in Naksha because React Aria keeps that one private.

**What the designer decides.** Which changes need words, and the words.

**What the developer must not break.** Call it after the change has happened, not before. Do not use it for text that is already visible and read in place.

| Test | Status |
| --- | --- |
| Card (axe, screenshots in light and dark) | Tested |
| Polite log, repeat, cleared after 7 seconds, interrupt, empty message, focus kept (component tests) | Tested |
| Regions made once, message added, focus kept (live browser) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.4.0 | New. Built by hand before as Otla Pages' `liveSay` (one polite region made on first use), Ledger's copy and sent notes (`role="status"`) and the portfolio's live lines in its try-it panels (`aria-live="polite"`). |
