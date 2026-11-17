# 0005. Devanagari falls back to Noto Sans Devanagari

Status: Proposed · 17 Nov 2026

## Context

Archivo, Newsreader and IBM Plex Mono have no Devanagari. Hindi or Marathi text would fall to whatever the OS has.

## Decision

Use Noto Sans Devanagari (OFL). It is variable on two axes, wdth 62.5 to 100 and wght 100 to 900 (checked in google/fonts METADATA.pb), so:

- UI and body text: wdth 100 next to Archivo.
- Display text: wdth 62.5 at weight 800, to sit next to Archivo Condensed. Same trick as Archivo: pin the axis with fontTools and ship an instance.

The token `font.devanagari` exists now. The font files ship in Phase 6.

## Open

- Matching x-height and weight to Archivo needs a visual pass with real Hindi and Marathi copy.
