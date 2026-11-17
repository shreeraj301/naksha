# Tabs

Switch between sibling views of the same thing (Overview / Research / Process).

## Usage

```jsx
import { Tabs } from "naksha";

<Tabs
  label="Case study sections"
  items={[
    { id: "overview", label: "Overview", content: <Overview /> },
    { id: "research", label: "Research", count: 22, content: <Research /> },
  ]}
/>
```

| Prop | Values | Default |
| --- | --- | --- |
| `label` | names the tab list |  |
| `items` | `{ id, label, count?, content, isDisabled? }[]` |  |
| `selectedKey`, `defaultSelectedKey`, `onSelectionChange` |  | the first tab |

## Best practices

- For actions use Buttons; for filters use SegmentedControl.

## Content

One or two words per tab.

## Anatomy and spacing

`label-m` labels in `fg-muted`, 40 tall, padding 12; the current tab is `fg-default` with a 2px ink rule. Counts sit beside the label in `mono-data`, `fg-subtle`.

## States

The rule slides between tabs on `ease-in-out` over 200ms. Hover darkens the label. Disabled tabs are `fg-disabled`.

## Accessibility

**What Naksha provides.** React Aria's Tabs: a `tablist` named by its label; arrow keys move between tabs and show their panel, disabled tabs are skipped, and Tab moves into the panel.

**What the designer decides.** The views and their order.

**What the developer must not break.** Give every tab a panel.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Hover, focus, disabled (screenshots, forced colours) | Tested |
| Arrow keys, skipping disabled (component tests) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.3.0 | React component on React Aria's Tabs. Arrow keys select as they move. |
| 0.2.0 | CSS component, v2 audit. |
