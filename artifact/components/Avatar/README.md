# Avatar

A person or an agent, at 24, 32, 40 or 48.

## Usage

```jsx
import { Avatar } from "naksha";

<Avatar name="Shreeraj Narwade" />
<Avatar name="garu" kind="agent" size="sm" />
<Avatar name="Aaditya Pandit" src="/a.jpg" />
```

| Prop | Values | Default |
| --- | --- | --- |
| `name` | whose it is: initials, and the name read by screen readers | none: the user icon, hidden |
| `kind` | `person` (round), `agent` (square, sparkle) | `person` |
| `src` | a photo | none |
| `size` | `xs` 24, `sm` 32, `md` 40, `lg` 48 | `md` |

## Best practices

- People are round, agents are square. The shape says at a glance whether a human or an AI is speaking.
- Next to a visible name, the avatar repeats it; that is fine, screen readers hear it once per avatar.

## Content

Initials are the first letters of the first and last name.

## Anatomy and spacing

People: `radius-round`, `bg-band`, initials in `fg-default`. Agents: `radius-control`, `section-plug`, a sparkles mark in ink. Initials are 36% of the size.

## States

Static.

## Accessibility

**What Naksha provides.** An avatar with a name is an image named by it ("garu, AI" for an agent); one without a name is hidden.

**What the designer decides.** Whose avatar, and whether a photo is used.

**What the developer must not break.** Pass `name` whenever the avatar stands for someone.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Names and hiding (component tests) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.3.0 | React component. Avatars with a name are named images. |
| 0.2.0 | CSS component, v2 audit. |
