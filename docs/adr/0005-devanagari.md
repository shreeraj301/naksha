# 0005. Devanagari falls back to Noto Sans Devanagari

Status: Accepted · 17 Nov 2026

## Context

Archivo, Newsreader and IBM Plex Mono have no Devanagari. Hindi or Marathi text would fall to whatever the OS has.

## Decision

Use Noto Sans Devanagari (OFL, copyright The Noto Project Authors). Its variable font has two axes, checked in google/fonts `ofl/notosansdevanagari/METADATA.pb` on 17 Nov 2026: wdth 62.5 to 100 and wght 100 to 900. So:

- UI and body text: wdth 100 next to Archivo.
- Display text: wdth 62.5 at weight 800, next to Archivo Condensed. Same method as Archivo Condensed: pin the axis with fontTools and ship an instance, renamed.

The token `font.devanagari` exists now. The font files ship in Phase 6, after a visual pass with real Hindi and Marathi copy to match x-height and weight to Archivo.
