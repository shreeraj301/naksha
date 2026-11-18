# Toast

A short message after an action: "Copied", "Saved", "Subscription cancelled". It comes and goes without taking focus.

## Usage

```jsx
import { Toaster, toast } from "naksha";

// once, near the root
<Toaster />

// anywhere
toast("Link copied");
toast.success("Subscription cancelled", { action: { label: "Undo", onPress: restore } });
toast.error("Could not send. Check your connection.", { action: { label: "Retry", onPress: send } });
const id = toast("Uploading the paper", { duration: Infinity });
toast.dismiss(id);
```

| Option | Values | Default |
| --- | --- | --- |
| `tone` | `neutral`, `success`, `danger` (or `toast.success`, `toast.error`) | `neutral` |
| `action` | `{ label, onPress }`: one verb; using it also closes the toast | none |
| `duration` | ms before it leaves; `Infinity` keeps it | `5000` |
| `onClose` | called when it closes, by a person or the timer | |

`Toast` is the same component as `Toaster`, under this card's name.

## Behaviour

The motion follows Emil Kowalski's write-up of Sonner.

- Bottom left, 16 from the edges, up to 420 wide. Three show at a time; more wait their turn.
- At rest they stack on the newest: each toast behind peeks 8 above the one in front and is 5% smaller, takes the front toast's height and hides its own text, so different heights never stick out.
- Hover or keyboard focus spreads them 8 apart. The gaps are filled, so moving between toasts does not collapse the stack.
- A new toast rises from below with opacity over 280ms (`dur-overlay`, `ease-out`); a leaving one fades and drops over 200ms. These are transitions, not keyframes, so toasts that arrive mid-flight retarget smoothly.
- It leaves after 5 seconds. The timer waits while the stack is hovered or focused and while the tab is hidden. A toast with an action stays until it is used or dismissed.
- Swipe down to dismiss: past 40, or a quick flick (faster than 0.11 px per ms, the value Sonner uses) once it has moved 8. Dragging up meets resistance and springs back.
- Under reduced motion toasts fade in place: nothing slides or scales.

## Best practices

- For reversible destructive actions, offer Undo here instead of a confirm dialog.
- One short sentence. If it needs a heading or a paragraph, it is an Alert on the page.
- Errors that block work belong next to the thing that failed. A toast can point to it.

## Content

Past tense for done things ("Link copied"), a fix for failures ("Check your connection."). Actions are one verb.

## Anatomy and spacing

`bg-inverse`, `fg-on-inverse`, at least 48 tall, padding 8 / 8 / 8 / 16, 12 between parts · tone icon 20 · action underlined · a small ghost Dismiss button.

## States

- Neutral, success (a `circle-check` in the success border colour) and danger (a `circle-alert` in the danger border colour). The tone is in the icon and the words, never in the colour alone.
- At rest the newest is in front and the others stack behind it; hover or keyboard focus spreads the stack (see Behaviour).
- Keyboard focus on a toast is the system outline, 2px `border-focus` 2 off; the action and Dismiss take their own outlines.
- Dismiss keeps its colour on hover, so the button never disappears into the dark toast.
- Leaving: it fades and drops over 200ms (`dur-ui`); while swiped it follows the finger with no transition.

## Accessibility

**What Naksha provides.** React Aria's toast region underneath, wrapped in Naksha's own small API because React Aria still marks it unstable: if it changes, only one file changes. The region is a landmark that names how many notifications it holds, and F6 moves focus to it. Each toast is announced once when it appears (`role="alert"`), is reachable by keyboard, and has a named Dismiss button. Timers pause while a person is reading or working in the stack.

**What the designer decides.** The message, the tone, and whether there is an action.

**What the developer must not break.** Keep one `<Toaster />` per page. Never put the only copy of important information in a toast.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Stack, spread on hover, timers pausing, swipe and spring back (live browser) | Tested |
| Action keeps it, dismiss fades it, 5 second timer (component tests) | Tested |
| Reduced motion (live browser) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.2.4 | React component on React Aria's toast region, with Sonner's stack, spread on hover, transitions, swipe to dismiss and pausing timers. |
| 0.2.0 | CSS component, v2 audit. |
