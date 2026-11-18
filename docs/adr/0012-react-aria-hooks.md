# 0012. React Aria's hooks, when its components cannot say what we need

Status: Accepted · 18 Nov 2026 (from 0.3.4)

## Context

Every Naksha component is built on React Aria Components (Roadmap, Phase 1). In 0.3.3 Slider was too, and two gaps showed up:

- **The spoken value.** React Aria Components writes a slider's `aria-valuetext` from `Intl.NumberFormat` and offers no way to replace it. A seek bar, the job Slider was built for in Otla Pages and the portfolio, needs "1:23 of 3:40". The best a number format gives is "83 seconds".
- **The disabled label.** React Aria Components names the slider with `aria-labelledby` and leaves the label's `for` out. Accessibility checkers only treat a label as inactive when it points at a disabled control, so a faded label failed the contrast check, and 0.3.3 kept it at full colour, unlike every other disabled field.

React Aria Components is built on two lower layers that ship with it at pinned versions: `react-aria` (the hooks: behaviour and ARIA) and `react-stately` (the state). With the hooks, Naksha renders the input itself, so it can set `aria-valuetext` and the label's `for`.

## Decision

A component uses React Aria Components by default. It drops to the `react-aria` hooks and `react-stately` state only when the component layer cannot express something a person needs, and the reason is written in the component's code and README. Slider is the first.

Naksha depends on `react-aria` and `react-stately` directly, pinned to the exact versions React Aria Components 1.22.1 pins (3.53.1 and 3.51.0), so there is one copy of each. All three stay external in the ES module build. They move together: upgrading React Aria Components means upgrading the other two to the versions it pins.

## What it costs

The hooks hand over more of the markup, so the component carries the data attributes its CSS reads (`data-hovered`, `data-dragging`, `data-focus-visible`, `data-disabled`) itself. The component tests and the screenshot tests are what keep them honest.

## Revisit

If React Aria Components adds a way to set a slider's value text, Slider goes back to it.
