# PromptInput

The composer for talking to an AI like garu.

## Anatomy and spacing
- Box: `bg-raised`, 1px `border-strong` at rest, 8 padding all round. Focus doubles the edge to 2px ink; no offset ring on a box this large.
- Text: `body-m` (15/1.5) with 8 / 8 / 4 inner padding, so the first character sits 16 from the edge. Two lines minimum, grows to eight, then scrolls.
- Toolbar: every control is 32. Ghost IconButtons for attach and dictate (their glyphs also land 16 from the edge), a quiet `mono-label` reading-level trigger, and one primary send.
- Under the box: a trust line ("garu can be wrong. Check the sources.") and the keyboard hint, `body-s` 12 in `fg-subtle`.

## Behaviour
- Enter sends, Shift+Enter adds a line. Send is disabled until there is text.
- Enter never sends while an input method is still composing a word (`isComposing`), so Hindi, Marathi or Japanese typing with an IME is not cut off mid-word.
- While streaming, Send becomes Stop (`square`, `aria-label="Stop generating"`) so a person can always interrupt.
- The reading level sits beside Send so people steer the answer before they ask, not after.
- Attachments appear as file chips above the text with a remove button.
