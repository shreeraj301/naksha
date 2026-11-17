# Modal

Blocks the page for one decision that needs full attention.

## Use
- The title asks the question; the buttons answer it with verbs ("Keep it" / "Cancel subscription"), never "OK" / "Cancel". Secondary first, primary or danger last.
- `bg-raised`, hairline edge, `shadow-overlay`, on `overlay-scrim`. Max width 480; a full-width bottom sheet on mobile.
- Header 24 / 16 / 0 / 24 with a small ghost close button; body 12 / 24 / 24; footer 16 / 24 on `bg-subtle` with a hairline above.
- `role="dialog"` `aria-modal="true"`, focus trapped, Escape closes, focus returns to the trigger.
- Enters with opacity and scale from 0.97 over 280ms, centred (modals do not grow from their trigger); exits in 200ms.
