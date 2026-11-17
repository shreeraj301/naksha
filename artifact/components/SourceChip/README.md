# SourceChip

Ties an AI claim to where it came from: a clause, a page, a URL.

## Usage

```jsx
import { SourceChip, Cite } from "naksha";

<p>the rent can rise by 5%.<Cite n={1} /></p>
<SourceChip n={1} label="Schedule A, clause 4.2" onPress={openClause} />
<SourceChip n={2} label="gov.in/rent-act" href="https://..." />
```

| Prop | Values | Default |
| --- | --- | --- |
| `n` | the number, matching `<Cite n>` in the text | |
| `label` | where the claim came from; cut to one line | |
| `onPress` or `href` | open the source in place, or link to it | |

## Best practices

- Numbered so a reader matches a claim to its source. Show sources by default on any answer that states a fact.
- Open the source at the cited spot (scroll to the clause, highlight the page), not at the top of the document.

## Content

Name the place, not the file: "Schedule A, clause 4.2", "Page 3, notice period".

## Anatomy and spacing

24 tall, hairline edge, up to 280 wide. The number sits on `bg-inverse` in `mono-data`; the label is `body-s` in `fg-muted`, 8 in.

## States

Hover and focus darken the edge and the label to `fg-default`; focus adds the system outline.

## Accessibility

**What Naksha provides.** A button, or a link with `href`, read as "Source 1: Schedule A, clause 4.2". The extra words are hidden text, so the name still contains what is visible.

**What the designer decides.** The label for each source.

**What the developer must not break.** Keep the numbers in the same order as the `<Cite>` marks.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Hover, focus (screenshots) | Tested |
| Name in Chrome and as a link (component and live browser tests) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.2.5 | React component with a spoken name. Cite marks the claim in the text. |
| 0.2.0 | CSS component, v2 audit. |
