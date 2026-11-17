# SuggestionChip

A prompt starter, written the way the person would ask.

## Usage

```jsx
import { SuggestionChip } from "naksha";

<SuggestionChip onPress={() => send("Explain clause 4.2")}>Explain clause 4.2</SuggestionChip>
```

| Prop | Values | Default |
| --- | --- | --- |
| `children` | the prompt | |
| `onPress` | send it, or fill the composer if it needs editing | |
| `isDisabled` | | `false` |

## Best practices

- Up to three, shown before the first message or after an answer, hidden once the person starts typing.
- Write them from what the person has open: "Is the deposit refundable?" beats "Ask a question".

## Content

A question or an instruction in the person's words, sentence case, no full stop.

## Anatomy and spacing

32 tall, 8 in on the arrow side and 12 on the right, `border-strong` edge, `label-s`, a 16 arrow 8 before the text.

## States

Hover fills with `state-hover` and nudges the arrow 2 right. A pointer press scales to 0.97; a keyboard press does not. Disabled uses `fg-disabled` for the text and the arrow.

## Accessibility

**What Naksha provides.** A real button, named by its text, pressed with Enter or Space.

**What the designer decides.** The three prompts.

**What the developer must not break.** Hide the chips, rather than disabling them, once they no longer apply.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Hover, focus, disabled (screenshots) | Tested |
| Press, and no press when disabled (component tests) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.2.5 | React component. The arrow greys out when disabled. |
| 0.2.0 | CSS component, v2 audit. |
