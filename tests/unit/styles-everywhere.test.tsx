// ADR 0009: every component in src/components.json takes `styles` and puts it on its outer element.
// Each one is rendered with a margin it could only get from `styles`; overlays use their inline form.
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { createElement as h, type ReactElement } from "react";
import * as N from "../../src";
import names from "../../src/components.json";

const styles = { marginTop: "7px" };
const C = N as unknown as Record<string, (p: any) => ReactElement | null>;

const cases: Record<string, ReactElement> = {
  Button: h(C.Button, { styles }, "Save"),
  IconButton: h(C.IconButton, { styles, label: "Close", icon: "x" }),
  ToggleButton: h(C.ToggleButton, { styles }, "Bold"),
  CopyButton: h(C.CopyButton, { styles, text: "x" }),
  PromptInput: h(C.PromptInput, { styles, label: "Ask" }),
  Input: h(C.Input, { styles, label: "Email" }),
  Textarea: h(C.Textarea, { styles, label: "Note" }),
  Select: h(C.Select, { styles, label: "Size", options: [{ id: "s", label: "Small" }] }),
  Checkbox: h(C.Checkbox, { styles }, "Keep"),
  Radio: h(C.RadioGroup, { styles, label: "Plan" }, h(C.Radio, { value: "a" }, "A")),
  Switch: h(C.Switch, { styles }, "On"),
  SegmentedControl: h(C.SegmentedControl, { styles, label: "View", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }] }),
  Slider: h(C.Slider, { styles, label: "Volume" }),
  DropdownMenu: h(C.DropdownMenu, { styles, label: "Actions", isInline: true, items: [{ id: "a", label: "Archive" }] }),
  Modal: h(C.Modal, { styles, title: "Delete", isInline: true }, "Sure?"),
  Drawer: h(C.Drawer, { styles, title: "Filters", isInline: true }, "Body"),
  Tooltip: h(C.Tooltip, { styles, content: "Save", isInline: true }),
  Toast: h(C.Toaster, { styles, preview: { layout: "list", toasts: [{ message: "Saved" }] } }),
  ChatMessage: h(C.ChatMessage, { styles, from: "user" }, "Hi"),
  ResponseStatus: h(C.ResponseStatus, { styles, steps: [{ label: "Read", status: "done" }] }),
  SourceChip: h(C.SourceChip, { styles, n: 1, label: "Lease" }),
  SuggestionChip: h(C.SuggestionChip, { styles }, "Try this"),
  Accordion: h(C.Accordion, { styles, items: [{ id: "a", title: "One", content: "Body" }] }),
  Alert: h(C.Alert, { styles, title: "Saved" }),
  Avatar: h(C.Avatar, { styles, name: "Asha Rao" }),
  Breadcrumb: h(C.Breadcrumb, { styles, items: [{ label: "Home", href: "/" }, { label: "Here" }] }),
  Card: h(C.Card, { styles, href: "/x", title: "Card" }),
  Image: h(C.Image, { styles, src: "a.png", alt: "A" }),
  Divider: h(C.Divider, { styles }),
  EmptyState: h(C.EmptyState, { styles, title: "Nothing yet" }),
  Kbd: h(C.Kbd, { styles }, "⌘K"),
  Link: h(C.Link, { styles, href: "/x" }, "Docs"),
  ProgressBar: h(C.ProgressBar, { styles, label: "Upload", value: 40 }),
  Skeleton: h(C.Skeleton, { styles }),
  Spinner: h(C.Spinner, { styles }),
  Table: h(C.Table, { styles, label: "People", columns: [{ key: "name", label: "Name" }], rows: [{ id: "1", name: "Asha" }] }),
  ListItem: h(C.ListItem, { styles, title: "Asha" }),
  Tabs: h(C.Tabs, { styles, label: "Views", items: [{ id: "a", label: "A", content: "Body" }] }),
  Tag: h(C.Tag, { styles }, "Beta"),
  SkipLink: h(C.SkipLink, { styles }),
  TopNav: h(C.TopNav, { styles, name: "Naksha" }),
};

describe("styles on every component (ADR 0009)", () => {
  const components = (names as string[]).filter((n) => n !== "announce");

  it("has a case for every component in components.json", () => {
    expect(Object.keys(cases).sort()).toEqual([...components].sort());
  });

  for (const name of components) {
    it(`${name} puts styles on an element it renders`, () => {
      const { container } = render(cases[name]);
      const host = (container.querySelector('[style*="margin-top: 7px"]') ?? document.body.querySelector('[style*="margin-top: 7px"]'));
      expect(host, `${name} rendered no element with the margin`).not.toBeNull();
    });
  }
});
