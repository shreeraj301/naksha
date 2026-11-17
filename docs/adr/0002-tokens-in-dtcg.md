# 0002. Tokens are written in W3C DTCG 2025.10

Status: Proposed · 17 Nov 2026

## Context

The v2 tokens lived in a Python script that wrote the artifact format directly. Nothing else could read them.

## Decision

Tokens are JSON files in the [Design Tokens Community Group format, 2025.10](https://www.designtokens.org/tr/2025.10/format/), with one resolver file (`tokens/naksha.resolver.json`) that says how they combine.

- `primitives/` holds raw values. Semantic tokens alias them and never hold a raw colour (a test enforces this).
- Themes are a resolver modifier: `themes/light.tokens.json` and `themes/dark.tokens.json` define the same names with different aliases.
- Colours use the object form (`colorSpace`, `components`, `hex`). Dimensions use `{ value, unit }` in px.
- Things the format has no type for live in `$extensions["dev.naksha"]`: letter-spacing in em, the `ch` unit on `size.measure`, mobile values for layout tokens, sample text for type styles.

The build (`scripts/build.mjs`) has no dependencies. It reads the resolver, resolves aliases and writes every output.

## Consequences

- Style Dictionary, Tokens Studio and other DTCG tools can read the source as is.
- Letter-spacing is stored twice: px in `$value` (valid DTCG) and em in the extension (what CSS uses). The build uses em.
