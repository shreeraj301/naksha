import type { Req } from "@/components/Ask";
/* The home page demo. Scripted: each request is matched by keywords and plays fixed steps. */
export const HOME_ASKS: Req[] = [
  { ask: "A sign-in form", match: "sign|log ?in|password|form", steps: [["Reading the Forms docs", "7 components"], ["Picking Input, Checkbox, Button and Link", "4 parts"], ["Checking both themes", "axe, light and dark"]],
    say: "Labels sit above the fields, there is one primary action, and the way out is a link under it.", build: "signin", sources: ["Input", "Checkbox", "Button", "Link"] },
  { ask: "A toast that can undo", match: "toast|undo|archive|delete", steps: [["Reading the Toast docs", "1 page"], ["Adding an Undo action", "stays until used"]],
    say: "A toast with an action doesn't time out, so nobody loses the Undo while reading.", build: "undo", sources: ["Toast", "Button"] },
  { ask: "An answer with its sources", match: "source|cite|answer|agent|chat", steps: [["Reading the AI set", "5 components"], ["Wiring citations to sources", "2 sources"]],
    say: "Each claim carries a number, and the numbers match the source chips under the answer.", build: "cite", sources: ["ChatMessage", "SourceChip", "ResponseStatus"] },
  { ask: "Something else", steps: [["Matching your request", "0 matches"]], say: "This demo knows three requests so far. Pick one of the suggestions to see it built.", build: "answer", sources: [] },
];
