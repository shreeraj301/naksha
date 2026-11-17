# 0008. fg-subtle keeps its value and stays off bg-subtle

Status: Accepted · 17 Nov 2026

## Context

`fg-subtle` (stone-600, #6a655d) on `bg-subtle` (stone-300, #ddd8ce) is 4.07:1 in light. AA for text needs 4.5:1. Dark passes.

Darkening stone-600 until it passes means #625d55 (4.6:1). That brings it to 1.17:1 against `fg-muted` (stone-700): the two text levels would look the same, and the hierarchy is the reason `fg-subtle` exists.

## Decision

Keep stone-600. `fg-subtle` is for `bg-canvas` (4.56:1) and `bg-raised` (5.13:1) only. On `bg-subtle`, use `fg-muted`, which components already do (table headers, file chips).

A test fails the build if the token's note stops saying this, or if `css/components.css` ever puts `fg-subtle` text on a `bg-subtle` background.

## Revisit

If a future component needs a third text level on `bg-subtle`, add a token for that pair rather than darkening stone-600.
