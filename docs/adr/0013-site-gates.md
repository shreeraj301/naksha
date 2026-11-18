# 0013. The website is tested like the components, and its known issues can only shrink

Status: Accepted · 19 Nov 2026

## Context

Until now CI checked the package and every component preview, but not the website that shows them. The 18 Nov audit found problems there that no test would have caught: page titles cut off with reduced motion on, code blocks a keyboard can't scroll, pages that scroll sideways on a phone. Fixing them one by one without a test means a later change can quietly bring one back.

The first run of the new checks found more than the audit did. With reduced motion on, React's hydration fails on 43 of the 51 pages (error #418). That failure re-renders `<html>` from the server copy, which says dark, so a reader who chose light and has reduced motion on gets the dark theme. Titles are cut off on 40 pages, and 13 pages scroll sideways at 320px, not two.

## Decision

`npm run test:site` (tests/site, its own Playwright config) runs against the static export in `site/out`. On every page, plus one address that doesn't exist, it runs these checks, in light and dark, with reduced motion on:

- **Screenshot:** a viewport screenshot (1280 by 800), compared with the saved copy.
- **Clipped text:** no text runs past an ancestor that hides overflow.
- **Console errors:** none.
- **Theme:** the reader's theme survives loading.
- **axe:** at every severity, on WCAG 2.0 to 2.2 A and AA plus best practice.

Every page is also loaded at 320px wide and must not scroll sideways.

Issues that exist today are listed in `tests/site/known-issues.json`, one entry per page, theme and rule, each naming the fix-list row that removes it. A run fails on any issue not on the list, and on any listed issue that no longer happens. So nothing new gets in, and a fix has to delete its entries. The list must reach empty.

## What it costs

About four minutes of CI and 102 screenshots in the repo. Any visual change to the site means updating the screenshots on purpose (`npm run test:site -- --update-snapshots`), the same as for the previews.

## What it doesn't cover

- **Focus ring contrast:** axe can't measure it. The menu's 1.17:1 ring (fix 1.2) needs its own test.
- **Speed:** LCP, CLS and page weight aren't measured here yet. That comes with the Phase 3 fixes.
- **Motion on:** the checks run with reduced motion on only. With motion on, titles animate, so the screenshots wouldn't be stable.

## Revisit

When `known-issues.json` is empty, remove it and the `gate` helper, and let every check fail directly.
