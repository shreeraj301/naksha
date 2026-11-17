# Textarea

Several lines of text that grow as people write, with a label, help, an error and an optional character count. For talking to an AI, use PromptInput.

## Usage

```jsx
import { Textarea } from "naksha";

<Textarea label="Paste the paper" maxLength={6000} description="We never store what you paste." />
```

| Prop | Values | Default |
| --- | --- | --- |
| `label` | visible label, required | |
| `maxLength` | stops typing at the limit and shows "0 / 6,000" | none |
| `rows` | lines shown when empty (the field is at least 120 tall either way); it grows to sixteen, then scrolls | `4` |
| `description`, `isInvalid`, `errorMessage`, `isOptional`, `isDisabled`, `isRequired` | as Input | |
| `value`, `defaultValue`, `onChange` | | |
| `styles` | layout only (ADR 0009) | |

## Best practices

- Same label, help and error rules as Input.
- Give a limit only when there is a real one, and say it before people hit it.
- The field grows with the text from 120 (about five lines) to 360 (sixteen), then scrolls, so a long paste never pushes the rest of the form off screen. There is no drag handle: it sizes itself.

## Content

Placeholder text names what goes in ("Paste a contract, a paper or a policy."). The count uses Indian digit grouping (`en-IN`), which matches the usual grouping up to 99,999.

## Anatomy and spacing

Label to field 8 · field padding 12 · the text area grows from 120 to 360, then scrolls · field to help 6 · the count sits on the right of the help line in `mono-data`, `fg-subtle`.

## States

As Input. At the limit the count turns `status-danger-fg`.

## Accessibility

**What Naksha provides.** React Aria's TextField with a `<textarea>`. The count is joined to the field's description, so a screen reader hears the limit with the help. A polite live region speaks twice at most: on entering the last 10% ("600 characters left") and at the limit. It does not speak on every keystroke.

**What the designer decides.** Whether there is a limit, and the help and error wording.

**What the developer must not break.** Keep `maxLength` and the count in step with what the server accepts.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Focus, error, disabled (screenshots, forced colours) | Tested |
| Count, limit announcements, typing, growing to sixteen lines | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.2.3 | Built on React Aria's TextField. Grows with its text to sixteen lines. Live count with limit announcements. Help on a disabled field stays readable. |
| 0.2.0 | CSS component, v2 audit. |
