# DropdownMenu

A list of actions, or a choice, that opens from a trigger: usually a ghost IconButton with `ellipsis`.

## Usage

```jsx
import { DropdownMenu, IconButton } from "naksha";

<DropdownMenu
  label="Paper actions"
  trigger={<IconButton label="More" icon="ellipsis" />}
  items={[
    { id: "copy", label: "Copy link", icon: "link", shortcut: "⌘C" },
    { id: "rename", label: "Rename", icon: "pencil" },
    { separator: true },
    { id: "delete", label: "Delete", icon: "trash-2", isDanger: true },
  ]}
  onAction={run}
/>
```

| Prop | Values | Default |
| --- | --- | --- |
| `trigger` | the button that opens it | |
| `items` | `{ id, label, icon?, shortcut?, isDanger?, isDisabled? }` or `{ separator: true }` | |
| `onAction` | gets the item `id` | |
| `title` | a `mono-label` heading at the top of the list | none |
| `selectionMode`, `selectedKey`, `defaultSelectedKey`, `onSelectionChange` | `"single"` turns the items into a choice with a check | `"none"` |
| `placement` | `bottom start`, `bottom end`, `top start`, `top end` | `bottom start` |
| `label` | names the menu when it stands alone; from a trigger, the trigger names it | |

## Best practices

- Seven items before you group. Danger items go last, after a separator.
- A menu is for actions that are not the main one. The main action is a Button you can see.
- A disabled item stays in the list so the menu does not change shape; say why elsewhere if it matters.

## Content

Items are verbs in sentence case ("Copy link", "Open in new tab"). Shortcuts are written for the platform: ⌘ ↵ ⇧ ⌫ are drawn icons, named for screen readers.

## Anatomy and spacing

List 4 inside the frame, 4 from the trigger, 240 wide · items 32 tall, padding 8, 16 icon in `fg-muted` · shortcut in `mono-data`, `fg-subtle` · separators run edge to edge.

## States

Hover and keyboard focus fill the item with `state-hover`. Danger items are `status-danger-fg`, and fill with `status-danger-bg`. Disabled items are `fg-disabled`. The list scales in from 0.97 with opacity over 200ms (`dur-ui`, `ease-out`) from the corner nearest the trigger, and fades out over 200ms.

## Accessibility

**What Naksha provides.** React Aria's MenuTrigger and Menu: the trigger says it opens a menu and whether it is open, Enter, Space or Arrow Down open it with focus on the first item (on the current choice in a choice menu), arrow keys move, typing a letter jumps, Enter acts, Escape closes and returns focus to the trigger, and disabled items are skipped. Choice menus use `menuitemradio` with `aria-checked`.

**What the designer decides.** The items, their order and grouping, and which are dangerous.

**What the developer must not break.** Do not put links or form fields inside items. Navigation belongs in links, not menus.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Hover, disabled, danger, choice (screenshots, forced colours) | Tested |
| Keyboard: open, move, skip disabled, act, Escape, focus return | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.2.4 | Built on React Aria's MenuTrigger and Menu. Shortcut keys are drawn icons. Opens and closes with an animation. |
| 0.2.0 | CSS component, v2 audit. |
