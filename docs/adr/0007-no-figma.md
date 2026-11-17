# 0007. No Figma library

Status: Accepted · 17 Nov 2026

## Decision

Naksha is maintained in two places: this repo, and the Claude Design System artifact built from it. There is no Figma library and no Figma sync.

- The artifact is the visual reference: every component, in both themes, with its spec drawing.
- The build has no Figma output.
- The v1 Figma file ("My Design System") stays as it is, frozen. Nothing updates it, and nothing deletes it.

## Consequences

- One fewer copy to keep in step, and no plan limits on writing variables.
- Design work that needs a canvas starts from the artifact or from code, not from Figma components.
- If a Figma library is ever needed, it can be generated from `tokens/` then. The token names already work as Figma paths.
