# Divider

Hairline rules between content, like the lines between sheets on the portfolio.

## Usage

```jsx
import { Divider } from "naksha";

<Divider />
<Divider variant="strong" />
<Divider label="Sheet 02 · Build" />
<Divider orientation="vertical" />
```

| Prop | Values | Default |
| --- | --- | --- |
| `variant` | `default`, `strong` | `default` |
| `orientation` | `horizontal`, `vertical` | `horizontal` |
| `label` | a mono heading set into the rule | none |

## Best practices

- `border-default` for most rules, `strong` for section ends.
- A labelled rule opens a group with a sheet code.

## Content

Labels are sheet codes in `mono-label`: "Sheet 02 · Build".

## Anatomy and spacing

1px. A vertical rule stretches to its row's height. A labelled rule puts the label first, 12 before the line.

## States

Static.

## Accessibility

**What Naksha provides.** React Aria's Separator: an `<hr>` across, a `separator` with `aria-orientation` upright.

**What the designer decides.** Where groups break.

**What the developer must not break.** Do not use a divider where spacing alone separates things well.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Roles (component tests) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.3.0 | React component on React Aria's Separator. |
| 0.2.0 | CSS component, v2 audit. |
