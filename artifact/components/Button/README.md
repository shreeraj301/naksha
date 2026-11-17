# Button

Buttons start an action. One `primary` per region; everything else is `secondary` or `ghost`.

## Usage

```jsx
import { Button } from "naksha";

<Button variant="primary" onPress={save}>Save changes</Button>
<Button iconStart="plus">New note</Button>
<Button variant="primary" isPending={saving}>Saving</Button>
```

Plain HTML: `<button type="button" class="nk-btn nk-btn--primary"><span>Save changes</span></button>`.

| Prop | Values | Default |
| --- | --- | --- |
| `variant` | `primary`, `secondary`, `ghost`, `highlight`, `danger` | `secondary` |
| `size` | `sm` (32), `md` (40), `lg` (48); 36, 44, 52 under touch | `md` |
| `iconStart`, `iconEnd` | an icon name (`"plus"`) or a node | none |
| `isPending` | shows a Spinner, ignores presses, stays focusable, keeps its colour | `false` |
| `isDisabled`, `isBlock` | | `false` |
| `onPress` | fires for mouse, touch, Enter and Space | |
| `styles` | layout only: margin, width, placement (ADR 0009) | |

## Best practices

- `primary` (ink) for the one thing the view is for. `secondary` (1px ink edge) beside it. `ghost` in toolbars, cards and dense rows.
- `highlight` is the portfolio's --action yellow: one marketing-style call to action per page, never inside forms.
- `danger` only for destructive, hard-to-undo actions, and always behind a confirm step or an Undo toast.
- Prefer explaining why an action is unavailable over disabling it.

| Do | Don't |
| --- | --- |
| One primary per region | Two primaries side by side |
| "Cancel subscription" on a danger button | "Yes" / "No" |
| Keep the label while loading | Replace the label with a spinner |

## Content

Write the label as a verb phrase in sentence case: "Save changes", "Explain this paper". Never "OK", "Submit" or "Click here".

## Anatomy and spacing

| Size | Height (touch) | Padding | Gap | Label | Icon |
| --- | --- | --- | --- | --- | --- |
| `sm` | 32 (36) | 12 | 6 | `label-s` | 16 |
| `md` | 40 (44) | 16 | 8 | `label-m` | 16 |
| `lg` | 48 (52) | 20 | 8 | `label-m` | 20 |

When an icon sits on one side, that padding drops 2px (`nk-btn--lead`, `nk-btn--trail`) so the drawn glyph, not its 16px box, lines up with text above it. The component adds these for you.

## States

Hover darkens (`action-primary-hover`) or adds `state-hover`. A pointer press scales to 0.97 in 140ms (`dur-press`, `ease-out`) so the button feels like it heard you; a keyboard press changes colour only, and under reduced motion nothing scales. Focus is the system outline (2px `border-focus`, 2px off). Disabled uses `bg-disabled` and `fg-disabled`. Pending keeps the label and swaps the leading icon for a Spinner, so the width never jumps.

## Accessibility

**What Naksha provides.** A real `<button type="button">` built on React Aria: Enter and Space press it, presses work the same for mouse, touch and keyboard, focus is always visible, and a pending button stays in the tab order while React Aria announces the change. Hover styles only apply to fine pointers. Works in Windows High Contrast.

**What the designer decides.** The label, and whether an action belongs behind a confirm step.

**What the developer must not break.** Use `<Button>` for actions and a link for navigation. Do not put a button inside a link or another button.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Hover, pressed, focus, disabled, pending (screenshots, forced colours) | Tested |
| Keyboard (Enter, Space, focus while pending) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.2.2 | Built on React Aria. Pending uses React Aria's pending state. Keyboard presses no longer scale. The pending spinner is heavier so it reads on filled buttons. |
| 0.2.0 | CSS component, v2 audit. |
