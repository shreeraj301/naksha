# Button

Buttons start an action. One `primary` per region; everything else is `secondary` or `ghost`.

## Use
- Write the label as a verb phrase in sentence case: "Save changes", "Explain this paper". Never "OK", "Submit" or "Click here".
- `primary` (ink) for the one thing the view is for. `secondary` (1px ink edge) beside it. `ghost` in toolbars, cards and dense rows.
- `highlight` is the portfolio's --action yellow: one marketing-style call to action per page, never inside forms.
- `danger` only for destructive, hard-to-undo actions, and always behind a confirm step or an Undo toast.

## Anatomy and spacing
| Size | Height (touch) | Padding | Gap | Label | Icon |
| --- | --- | --- | --- | --- | --- |
| `nk-btn--sm` | 32 (36) | 12 | 6 | `label-s` | 16 |
| default | 40 (44) | 16 | 8 | `label-m` | 16 |
| `nk-btn--lg` | 48 (52) | 20 | 8 | `label-m` | 20 |

Add `nk-btn--lead` / `nk-btn--trail` when an icon sits on that side: the padding drops 2px so the drawn glyph, not its 16px box, lines up with text above it.

## States
Hover darkens (`action-primary-hover`) or adds `state-hover`. Pressed scales to 0.97 in 140ms (`dur-press`, `ease-out`) so the button feels like it heard you. Focus is the system outline (2px `border-focus`, 2px off). Disabled uses `bg-disabled` and `fg-disabled`; prefer explaining why over disabling. Loading keeps the label, swaps the leading icon for a Spinner and sets `aria-busy="true"`, so the width never jumps.

## Accessibility
Use `<button>` for actions and `<a class="nk-btn">` only for navigation. Hover styles live behind `(hover: hover) and (pointer: fine)`; touch heights grow to 44px.

## Do / Don't
| Do | Don't |
| --- | --- |
| One primary per region | Two primaries side by side |
| "Cancel subscription" on a danger button | "Yes" / "No" |
| Keep the label while loading | Replace the label with a spinner |
