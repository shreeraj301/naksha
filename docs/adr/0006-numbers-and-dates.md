# 0006. Indian number grouping and day-month-year dates

Status: Proposed · 17 Nov 2026

## Decision

Numbers and money use `Intl` with the `en-IN` locale.

| Input | Output |
| --- | --- |
| `125000` as INR, no decimals | ₹1,25,000 |
| `1250` as INR | ₹1,250.00 |
| `12500000` | 1,25,00,000 |

Dates are day, short month, year: **18 Dec 2026**. In mono data styles they are caps: **18 DEC 2026**.

## Watch out

Current CLDR data spells September "Sept" in en-IN and en-GB (`8 Sept 2026`, checked in Node 22). That breaks the three-letter rhythm in tables. The formatter must take `formatToParts` and cut the month to three letters, and pad the day to two digits in tables so columns line up.

## Open

- Products for a non-Indian audience may want 125,000. That becomes a locale option, not a second token.
