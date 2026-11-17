# Table

Dense, scannable rows (Found It subscriptions, Ledger statements).

## Use
- A real `<table>` with `<th scope="col">`. Header is `mono-label` in `fg-muted` on `bg-subtle` with a `border-strong` rule; rows are 48 with hairlines.
- Numbers and dates in `mono-data` with tabular figures; amounts right-aligned so decimals line up.
- Hover is `state-hover`; selected is `state-pressed` plus `aria-selected`. Totals sit in a `<tfoot>` under a strong rule.
