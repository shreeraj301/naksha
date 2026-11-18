"use client";
import * as Naksha from "naksha";
import { createElement as h, useEffect, useState, type ReactNode } from "react";

/* Ask Naksha: a scripted demo. A request plays its steps, then answers, sometimes by building interface from live
   Naksha components. It never pretends to be a model: typed text is matched to the known requests, and anything else says so. */
export interface Req { ask: string; match?: string; steps: [string, string][]; say: string; build: string; sources: string[] }
const N = Naksha as unknown as Record<string, any>;
const noop = () => {};

function build(kind: string): ReactNode {
  if (kind === "signin") return h("div", { className: "plate" }, h("span", { className: "cap" }, "Sign in, built from 4 components"),
    h(N.Input, { label: "Email", type: "email", placeholder: "name@company.com" }), h(N.Input, { label: "Password", type: "password" }),
    h(N.Checkbox, { defaultSelected: true }, "Keep me signed in"), h(N.Button, { variant: "primary", isBlock: true }, "Sign in"), h(N.Link, { href: "#" }, "Forgot your password?"));
  if (kind === "undo") return h("div", { className: "plate" }, h("span", { className: "cap" }, "Press it. The toast waits until you use it or close it."),
    h("div", null, h(N.Button, { variant: "secondary", iconStart: "inbox", onPress: () => N.toast("Note archived", { action: { label: "Undo", onPress: () => N.toast.success("Note is back") } }) }, "Archive note")));
  if (kind === "cite") return h("div", { className: "plate wide" }, h("span", { className: "cap" }, "An agent's answer, with where it came from"),
    h(N.ChatMessage, { from: "assistant", name: "your agent", status: "AI · reads your sources", sources: [{ label: "Lease, clause 4.2", onPress: noop }, { label: "Page 3, notice period", onPress: noop }] },
      "The rent can go up once a year, by no more than 5%.", h(N.Cite, { n: 1 }), " The landlord has to tell you in writing 30 days before.", h(N.Cite, { n: 2 })));
  return null;
}

function Feed({ r, n }: { r: Req; n: number }) {
  const reduce = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [step, setStep] = useState(reduce ? 99 : 0);
  useEffect(() => {
    if (step > r.steps.length) return;
    const t = setTimeout(() => setStep(step + 1), step === 0 ? 500 : 700);
    return () => clearTimeout(t);
  }, [step, r]);
  const done = step > r.steps.length;
  const steps = r.steps.map((x, k) => ({ label: x[0], detail: x[1], status: k < step ? "done" : k === step ? "running" : "pending" }));
  const src = r.sources.map((label) => ({ label, onPress: noop }));
  return h(N.Thread, { label: "Conversation with Naksha", key: n },
    h(N.ChatMessage, { from: "user" }, r.ask),
    h(N.ChatMessage, done ? { from: "assistant", name: "naksha", status: "AI · reads the docs", sources: src, onCopy: noop } : { from: "assistant", name: "naksha", state: "streaming" },
      h(N.ResponseStatus, { steps, defaultExpanded: !done }), done ? h("p", { style: { margin: "12px 0 0" } }, r.say) : null, done ? build(r.build) : null));
}

export function Ask({ reqs, fallback, title, note, layout, chipsFrom = 0, chipsTo }: { reqs: Req[]; fallback?: number; title: string; note: string; layout: "home" | "side"; chipsFrom?: number; chipsTo?: number }) {
  const [cur, setCur] = useState({ i: 0, n: 0 });
  const run = (i: number) => setCur((c) => ({ i, n: c.n + 1 }));
  const submit = (v: string) => {
    const s = (v || "").toLowerCase();
    const hit = reqs.findIndex((r) => r.match && new RegExp(r.match).test(s));
    run(hit >= 0 ? hit : fallback ?? 0);
  };
  const chips = h("div", { className: "chips" }, reqs.slice(chipsFrom, chipsTo).map((r, k) => h(N.SuggestionChip, { key: k, onPress: () => run(k + chipsFrom) }, r.ask)));
  const pane = h("div", { className: "pane", role: "region", "aria-label": title },
    h("div", { className: "bar" }, h("b", null, title), h("span", null, note)),
    h("div", { className: "feed" }, h(Feed, { r: reqs[cur.i], n: cur.n, key: cur.n })),
    layout === "side" ? chips : null);
  if (layout === "side") return pane;
  return h("div", { className: "grid" },
    h("div", { className: "q" }, h("h2", { id: "ah" }, "Ask it to build something."),
      h("p", null, "Naksha answers with its own components, the same way an agent reads these docs. Pick a request, or type one."),
      h(N.PromptInput, { label: "Ask Naksha", placeholder: "A sign-in form, a toast with undo", onSubmit: submit }), chips),
    pane);
}
