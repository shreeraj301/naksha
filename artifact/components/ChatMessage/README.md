# ChatMessage

One turn in a conversation with an AI. Put turns in a `Thread`. The examples use garu, the AI assistant on Shreeraj's portfolio, which writes in lowercase.

## Usage

```jsx
import { Thread, ChatMessage, Cite, Generated } from "naksha";

<Thread label="Conversation with garu" isBusy={streaming}>
  <ChatMessage from="user" onEdit={edit}>Explain clause 4.2 like I have never signed a lease before.</ChatMessage>
  <ChatMessage
    from="assistant"
    name="garu"
    status="AI · reads your sources"
    state={streaming ? "streaming" : "done"}
    steps={steps}
    sources={[{ label: "Schedule A, clause 4.2", onPress: openClause }]}
    onCopy={copy}
    feedback={feedback}
    onFeedback={setFeedback}
    onRetry={retry}
  >
    {["clause 4.2 says the rent can go up once a year, by no more than 5%.", <Cite n={1} />]}
  </ChatMessage>
</Thread>
```

| Prop | Values | Default |
| --- | --- | --- |
| `from` | `user`, `assistant` | |
| `name` | the agent's name, shown and read before its turn | `Assistant` |
| `status` | the mono line beside the name when done | `AI` |
| `children` | a string, or strings and `<Cite n>`, become one paragraph; anything else is placed as it is | |
| `state` | `done`, `streaming`, `error` | `done` |
| `steps` | the trace of what the agent did (see ResponseStatus) | none |
| `sources` | `{ label, onPress?, href? }[]`, numbered in order | none |
| `error`, `onRetry` | what went wrong, and Try again | |
| `onCopy`, `feedback`, `onFeedback` | the actions under a finished reply | |
| `onEdit` | on a person's turn: edit and send again | |

`Thread`: `label` names the conversation, `isBusy` marks a reply in progress, and `styles` places it (give its parent a height; it scrolls inside). `Generated`: content the agent made for the person to use, with a `title` and an optional `onCopy`.

## Best practices

- Any answer that states a fact carries numbered sources that match `<Cite n>` marks in the text. This is how people learn how far to trust the agent.
- Every AI action can be undone or redone: Stop in the composer, Try again on a reply, Edit on a person's turn.
- Show the steps when the agent does real work (reads, searches, compares). For a plain answer, skip them.
- Put drafts and summaries meant to be used elsewhere in `Generated`, so they read as the person's material, not the conversation.

## Content

garu writes in lowercase. Errors say what happened and what was kept: "garu lost the thread halfway. nothing was saved."

## Anatomy and spacing

A person's turn is a `bg-subtle` block on the right, up to 75% wide, no avatar. The agent's turn has a 28 square agent avatar, its name, a `mono-label` status, and no bubble, so long answers read like a page (`body-l`, measure 64ch). Name row to text 12 · sources 6 apart · actions are 32 ghost IconButtons with tooltips · turns 32 apart. Generated content is a hairline box in the reading face (Newsreader 18), its title a `mono-label`.

## States

Streaming shows the running step (or "Thinking"), three pulsing squares and a block caret; sources and actions wait until it is done. A failed reply says what happened in `status-danger-fg` and offers Try again. A chosen thumb keeps an ink edge.

## Accessibility

**What Naksha provides.**
- The thread is a `feed` of `article`s, each named ("You said", "garu said") and numbered, with one Tab stop.
- Arrow keys, Page Up and Page Down move between messages; Home and End jump to the ends.
- While a reply streams the feed is busy, so screen readers do not read it word by word. When it finishes it is announced once, through a polite live region.
- The view follows the newest message only while you are at the end, and nothing ever moves focus.
- Sources are read as "Source 1: Schedule A, clause 4.2". Thumbs say whether they are pressed.

**What the designer decides.** The agent's name, what counts as a step, which sources to show, and the error wording.

**What the developer must not break.** Set `isBusy` on the Thread while a reply streams and switch `state` to `done` at the end, or the reply is never announced. Keep messages as direct children of the Thread.

| Test | Status |
| --- | --- |
| Default state (axe, screenshots in light and dark) | Tested |
| Streaming, error, sources, actions (screenshots, component tests) | Tested |
| Keyboard through the thread, announce once, follow the newest without moving focus (component and live browser tests) | Tested |
| Screen reader | Not tested yet |

## Release phase

Beta. Stable at Naksha 1.0.

## Change log

| Version | Change |
| --- | --- |
| 0.2.5 | React components: Thread, ChatMessage, Cite and Generated. Keyboard thread, one announcement per reply, steps, edit, pressed thumbs. |
| 0.2.0 | CSS component, v2 audit. |
