# EmptyState

What a view shows before it has data: what will appear here, and one way to start.

## Usage

```jsx
import { EmptyState, Button } from "naksha";

<EmptyState icon="inbox" code="Nothing drawn here yet" title="No subscriptions yet" action={<Button variant="primary">Connect inbox</Button>}>
  Forward a receipt or connect your inbox and Found It will list them here.
</EmptyState>
```

| Prop | Values | Default |
| --- | --- | --- |
| `title` | what would be here |  |
| `children` | how to fill it, in one sentence |  |
| `icon` | an icon name | `inbox` |
| `code` | a quiet mono line above the title | none |
| `action` | the one thing to do next | none |

## Best practices

- One action. If there is nothing to do, say when it will fill instead.

## Content

Say what will appear, then how. Never "No data".

## Anatomy and spacing

A dashed `border-strong` frame (on a drawing, a dashed line means "not built yet"), a 48 icon well on `bg-subtle`, a `mono-label` note, a `title-s` title, one sentence in `fg-muted` (34ch at most) and one primary button. Padding 48 / 32, gaps 16.

## States

Static.

## Accessibility

**What Naksha provides.** Plain text and a real button; the icon is decorative.

**What the designer decides.** The words and the one action.

**What the developer must not break.** Keep the action a Button or Link, not a click handler on the frame.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.3.0 | React component. |
| 0.2.0 | CSS component, v2 audit. |
