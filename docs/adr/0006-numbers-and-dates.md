# 0006. Indian number grouping and day-month-year dates

Status: Accepted · 17 Nov 2026

## Decision

Numbers and money use `Intl` with the `en-IN` locale. Checked in Node 22 and in Chrome 156 on 17 Nov 2026, both give:

| Input | Output |
| --- | --- |
| `125000` as INR, no decimals | ₹1,25,000 |
| `1250` as INR | ₹1,250.00 |
| `12500000` | 1,25,00,000 |
| `12500000`, compact | 1.3Cr |

Dates are day, short month, year: **18 Dec 2026**. In mono data styles they are caps: **18 DEC 2026**.

## Watch out

Both runtimes spell September "Sept" in en-IN (`8 Sept 2026`, parts `day:8 | month:Sept | year:2026`). That breaks the three-letter rhythm in tables. The formatter (Phase 6) takes `formatToParts`, cuts the month to three letters, and pads the day to two digits in tables so columns line up.

## Later

A product for a non-Indian audience may want 125,000. That becomes a locale option on the formatter, not a second token.
