# 0001. GitHub is the source of truth

Status: Accepted · 17 Nov 2026

## Context

Naksha lives in two places: this repo and the Claude Design System artifact. Two hand-edited copies drift within a week.

## Decision

The repo is the only place a token or component is edited. The artifact is an output, regenerated from `dist/artifact/` on every release.

There is no Figma library (see 0007).

## Consequences

- A change made directly in the artifact is lost on the next sync. Bring it back here first.
- Every release needs a build, so CI must stay green.
