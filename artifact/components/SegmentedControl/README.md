# SegmentedControl

Switch between two to four views or modes with every option visible, like the portfolio's Human / Agent toggle.

## Use
- Mono caps labels (`mono-label`). The selected option fills with `action-primary`; the fill moves on `ease-in-out` over 200ms.
- `role="radiogroup"`, arrow keys move the selection.
- Inside a composer or toolbar use `sn-seg--quiet`, or a compact menu trigger: a full bordered control there competes with the main action.
