# Breadcrumb

Where this page sits, in `mono-label` caps like the portfolio's sheet labels.

## Usage

```jsx
import { Breadcrumb } from "naksha";

<Breadcrumb items={[{ label: "Read", href: "/read" }, { label: "RD-02", href: "/read/rd-02" }, { label: "Ledger" }]} />
```

| Prop | Values | Default |
| --- | --- | --- |
| `items` | `{ label, href? }[]` from the top down; the last is the current page |  |
| `label` | names the trail when a page has more than one | `Breadcrumb` |

## Best practices

- Only on pages two or more levels deep.
- Do not repeat the page title as a link: the last crumb is the current page.

## Content

Use the labels people see in the navigation, in the same words.

## Anatomy and spacing

Links in `fg-muted`, the current page in `fg-default`. Separators are `/` in `fg-subtle`, 8 apart.

## States

Hover underlines a link and darkens it. Focus is the system outline.

## Accessibility

**What Naksha provides.** React Aria's Breadcrumbs inside `<nav aria-label="Breadcrumb">`, as an ordered list. The current page has `aria-current="page"` and is not a link.

**What the designer decides.** The trail.

**What the developer must not break.** Keep the last item without an `href`.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Hover (screenshots) | Tested |
| Current page (component tests) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.3.0 | React component on React Aria's Breadcrumbs. |
| 0.2.0 | CSS component, v2 audit. |
