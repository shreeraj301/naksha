# Slider

A number picked from a range by dragging or with the arrow keys: volume, a budget ceiling, a playback position.

## Usage

```jsx
import { Slider } from "naksha";

<Slider label="Volume" defaultValue={0.4} maxValue={1} step={0.01} formatOptions={{ style: "percent" }} />
<Slider
  label="Budget ceiling"
  value={budget}
  onChange={setBudget}
  maxValue={100000}
  step={1000}
  formatOptions={{ style: "currency", currency: "INR", maximumFractionDigits: 0 }}
/>
<Slider label="Playback position" value={t} maxValue={220} onChangeEnd={seek} formatOptions={{ style: "unit", unit: "second", unitDisplay: "long" }} />
```

| Prop | Values | Default |
| --- | --- | --- |
| `label` | what the number is; always visible | |
| `value`, `onChange` | control it; `onChange` fires on every step of a drag | |
| `defaultValue` | starts here, and manages itself | `minValue` |
| `onChangeEnd` | fires once, when the drag or key press ends | |
| `minValue`, `maxValue` | | `0`, `100` |
| `step` | how far one arrow key moves | `1` |
| `formatOptions` | `Intl.NumberFormatOptions`: how the value is written and read aloud | plain number |
| `showValue` | show the value beside the label | `true` |
| `isDisabled` | | `false` |
| `styles` | layout only: margin, width, placement (ADR 0009) | |

## Best practices

- Use a Slider when the rough position matters more than the exact number, and the person can see the effect as they drag (volume, a seek bar, a filter ceiling).
- When the exact number matters (a rent amount, a quantity), use an Input. A slider makes exact values slow to reach.
- Save, seek or fetch in `onChangeEnd`, not in `onChange`, so a drag does not send fifty requests.
- One value per slider. A range with two thumbs is not in Naksha yet.

| Do | Don't |
| --- | --- |
| "Volume", with "40%" beside it | A slider with no label and no value |
| `formatOptions` with the unit | A unit typed into the label ("Volume (%)") |

## Content

The label names the thing in sentence case, without the unit. The unit lives in `formatOptions`, so the written value and the spoken one always match: a person hears "40%" or "83 seconds", never "0.4" or "83".

React Aria builds both from `Intl.NumberFormat`, so a clock time like "1:23" cannot be written yet. For a playback position, use seconds or minutes as a unit, or set `showValue={false}` and show the time nearby. The spoken value is still the number with its unit.

## Anatomy and spacing

The label row is the field label (13, weight 500) on the left and the value in mono 13, muted, on the right. 4 below it is the track: a hit area 24 tall (44 under touch), with a 2px line in `border-strong` across its middle, an ink fill from the start edge to the thumb, and a 16 square ink thumb in a 24 hit area (44 under touch). The thumb's top sits 8 under the label. Max width 360, like a field. Corners 0.

## States

Hovering the track grows the thumb to 18; dragging grows it to 20, over 140ms (`dur-press`, `ease-out`). Under reduced motion the size changes without the transition. Focus is the system outline, 2 off the thumb. Disabled fades the line, the fill and the thumb; the label and value keep their colours, because React Aria's label is not tied to the disabled input and faded text there fails contrast checks. In a right-to-left locale (set with React Aria's `I18nProvider`) the fill and the thumb run from the right. In Windows High Contrast the line is `CanvasText`, the fill and thumb are `Highlight`, and disabled is `GrayText`.

## Accessibility

**What Naksha provides.** React Aria's Slider: a real `<input type="range">` inside the thumb, named by the label, with `aria-valuetext` from `formatOptions`. Arrow keys move one step, Page Up and Page Down a tenth of the range, Home and End the ends. Dragging works with mouse, touch and pen, and clicking the track moves the thumb there.

**What the designer decides.** The range, the step and the unit, and whether the exact number deserves an Input instead.

**What the developer must not break.** Keep the label visible. Put the unit in `formatOptions`, not in the label, so screen readers hear it.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| At rest, hover, focus, dragging, disabled (screenshots, forced colours) | Tested |
| Arrow keys, Home, End, `onChangeEnd`, spoken value, disabled (component tests) | Tested |
| Touch on a real phone | Not tested yet |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.3.3 | New. Built by hand before as the Otla Pages player seek and the portfolio walkthrough seek. |
