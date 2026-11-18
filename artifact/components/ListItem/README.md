# ListItem

One row of a List: a small picture, a title with a line under it, a sentence, something on the right, and actions.

## Usage

```jsx
import { Avatar, Button, Image, List, ListItem, Tag } from "naksha";

<List label="Worth a look">
  <ListItem
    media={<Avatar name="Netflix" />}
    title="Netflix"
    meta="₹649 a month"
    description="Went up from ₹499 to ₹649. That is ₹1,800 more a year."
    actions={
      <>
        <Button variant="primary" size="sm" onPress={review}>Review cancel</Button>
        <Button variant="ghost" size="sm" onPress={keep}>Keep it</Button>
      </>
    }
  />
  <ListItem
    media={<Image src={tile} alt="" ratio="1/1" />}
    title="Kitchen tiles: matte grey"
    meta="Site visit · 12 Nov · Priya, client"
    trailing={<Tag tone="success" hasDot>Approved</Tag>}
    href="/decisions/kitchen-tiles"
  />
</List>
```

| Prop | Values | Default |
| --- | --- | --- |
| `title` | what the row is | |
| `media` | an Avatar, or an Image with `alt=""`; hidden from screen readers | none |
| `meta` | one short line under the title: price, phase, date | none |
| `description` | a sentence or two | none |
| `trailing` | on the right, beside the title: an amount or a Tag | none |
| `actions` | buttons for this row, under the text | none |
| `href` | makes the picture, the text and the trailing part one link | none |

`List` holds the rows. Give it a `label` when no heading right above it says what it holds, and `styles` for layout (ADR 0009).

## Best practices

- A row is a link, or it has actions, or both. When it is both, the link covers the picture, the text and the trailing part, and the actions sit under it as their own buttons. Nothing interactive goes inside the link. This is how Ledger's "Waiting on" rows work: the row opens the request, and Copy link sits beside it.
- Keep the actions to two, the main one first: "Review cancel" then "Keep it", as in Found It.
- Use a Table instead when people compare the same columns down many rows. Use ListItems when each row is read on its own.
- Keep the rows in one List alike: all with pictures of the same kind, or none.

| Do | Don't |
| --- | --- |
| Title "Netflix", meta "₹649 a month" | Title "Netflix ₹649 a month" |
| A Tag in `trailing` for status | A coloured title for status |

## Content

The title names the thing in sentence case, not the action. `meta` is facts separated by " · ", most useful first. `description` says why the row is here or what changed, in plain words with the numbers.

## Anatomy and spacing

Rows sit between hairline rules in `border-default`, 20 above and below each, like Accordion. The picture is on the left with 16 to the text; a thumbnail Image is 80 wide unless you give it a width, and an Avatar keeps its own size. Title in 17, weight 600; `meta` 4 below in `body-s`, muted; `description` 8 below that in `body-m`, muted, up to 64 characters wide. `trailing` sits on the right at the title's line. Actions sit 12 under the text, 8 apart, lined up with the text, not the picture. The List is up to 640 wide.

## States

A linked row underlines its title in `border-strong` on hover, as Accordion does. Focus is the system outline, 2 off the row's content. A row without `href` has no hover: only its actions respond.

## Accessibility

**What Naksha provides.** A real `<ul>` of `<li>`, named by `label`. The picture is hidden from screen readers, because the title already names the row. With `href` the content is one React Aria link, and every action is outside it, so a screen reader meets the link and then each button, never a button inside a link.

**What the designer decides.** What the row links to, which actions it carries, and what goes on the right.

**What the developer must not break.** Do not put a link or a button in `media`, `meta`, `description` or `trailing`: put actions in `actions`. Do not wrap a whole row in your own link.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Actions, trailing tag, linked hover, linked focus (screenshots) | Tested |
| List and its name, hidden picture, one link with the actions outside it (component tests) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.3.5 | New, with List. Built by hand before as Found It's "Worth a look" (initial, name, price a month, reason, Review cancel and Keep it) and Ledger's decision and request rows (photo, status, date). |
