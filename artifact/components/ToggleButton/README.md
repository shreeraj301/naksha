# ToggleButton

One button that stays pressed until it is pressed again: sound on, night mode, a filter. Off it looks like a secondary Button; on it fills with ink.

## Usage

```jsx
import { ToggleButton } from "naksha";

<ToggleButton isSelected={sound} onChange={setSound}>Sound</ToggleButton>
<ToggleButton icon="sparkles" defaultSelected>Agent view</ToggleButton>
<ToggleButton icon="eye" label="Show hidden items" size="sm" />
```

| Prop | Values | Default |
| --- | --- | --- |
| `children` | the name of what it turns on | none |
| `icon` | an icon name or a node, before the label; with `label` and no children, the whole button | none |
| `label` | the name when there is no visible text | |
| `isSelected`, `onChange` | control it; `onChange` gets `true` or `false` | |
| `defaultSelected` | starts on, and manages itself | `false` |
| `size` | `sm` (32), `md` (40), `lg` (48); 36, 44, 52 under touch | `md` |
| `isDisabled` | | `false` |
| `styles` | layout only: margin, width, placement (ADR 0009) | |

## Best practices

- Use it for one setting that is on or off and takes effect at once. For a setting inside a form that is saved later, use a Switch or a Checkbox.
- For two to five choices where exactly one is on (Day, After hours, Blueprint), use a SegmentedControl, not a row of toggles.
- A row of filters can be toggles side by side. Put them in a group with a visible heading ("Show") so the row has a name.

| Do | Don't |
| --- | --- |
| "Sound", pressed or not | "Sound on" that becomes "Sound off" |
| Name an icon-only toggle with `label` | Leave the icon to explain itself |

## Content

Name the thing it turns on, in one or two words in sentence case. The name never changes when it is pressed: the fill shows the state, and screen readers hear "pressed" or "not pressed".

## Anatomy and spacing

The same box as Button: 40 tall (32 small, 48 large), side padding 16 (12 small, 20 large), icon 16 with an 8 gap. Icon only is a square IconButton. Off: a 1px ink edge on the page. On: `action-primary` fill with `action-on-primary` text. Corners 0.

## States

Off hover lays `state-hover` over the page; on hover steps to `action-primary-hover`, and pressing steps to `action-primary-pressed`. A pointer press scales to 0.97 (0.94 for icon only) for 140ms; a keyboard press never moves. Focus is the system outline, 2 off the edge. Disabled and off is a faded edge; disabled and on keeps a faded fill, so the state still reads. In Windows High Contrast, on uses the system highlight.

## Accessibility

**What Naksha provides.** A real `<button>` with `aria-pressed`, built on React Aria's ToggleButton: Enter and Space toggle it, presses work the same for mouse, touch and keyboard, and focus is always visible. An icon-only toggle is named by `label`.

**What the designer decides.** What it turns on, and whether it belongs on its own or in a group.

**What the developer must not break.** Keep the name the same in both states. Do not swap it for a Switch with `role="switch"` unless it sits inside a settings list.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Off, on, hover, focus, disabled (screenshots, forced colours) | Tested |
| Pressed state, Space, icon-only name, controlled, disabled (component tests) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.3.2 | New. Built by hand before in Otla Pages (sound), the portfolio lab (Night) and Ledger (filters). |
