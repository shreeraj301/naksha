# Spinner

An indeterminate wait inside a control or a small area.

## Usage

```jsx
import { Spinner } from "naksha";

<Spinner size="sm" />
<Spinner size="lg" label="Loading the paper" />
```

| Prop | Values | Default |
| --- | --- | --- |
| `size` | `sm` 16, `md` 24, `lg` 32 | `md` |
| `label` | say what is loading when the spinner is the only sign of it | none: hidden |

## Best practices

- Inside a button, use the Button's `isPending` instead.

## Content

The label says what is loading.

## Anatomy and spacing

A quarter arc in `currentColor` over a faint ring, one turn every 900ms, linear (a faster spin reads as a faster app). Inside a button the line is heavier so it reads on filled buttons.

## States

Under reduced motion it stops turning and pulses slowly.

## Accessibility

**What Naksha provides.** With a `label` it is a named image; without one it is hidden, and the region should carry `aria-busy`.

**What the designer decides.** Where waiting shows.

**What the developer must not break.** Do not show a spinner for less than about 300ms of work.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.3.0 | `size` takes `sm`, `md` and `lg` (16, 24, 32); `md` is the default. |
| 0.2.0 | CSS component, v2 audit. |
