# 0003. One name, three spellings

Status: Accepted · 17 Nov 2026

## Decision

A token's path is its name. Each platform joins the path its own way:

| Path | CSS | JS |
| --- | --- | --- |
| `bg.canvas` | `--bg-canvas` | `color.light["bg-canvas"]` |
| `space.16` | `--space-16` | `space["16"]` |
| `text.body-m` | `.body-m` | `text["body-m"]` |

CSS variables carry no `--naksha-` prefix. They match the v2 artifact, so its previews keep working without edits.

## Consequences

- If Naksha ever ships next to another system on one page, the CSS names could collide. Adding a prefix then is one line in the build.
