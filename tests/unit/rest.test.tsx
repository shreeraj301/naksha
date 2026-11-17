import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "../../src/components/Accordion";
import { Alert } from "../../src/components/Alert";
import { Avatar } from "../../src/components/Avatar";
import { Breadcrumb } from "../../src/components/Breadcrumb";
import { Card } from "../../src/components/Card";
import { Divider } from "../../src/components/Divider";
import { Kbd } from "../../src/components/Kbd";
import { Link } from "../../src/components/Link";
import { ProgressBar } from "../../src/components/ProgressBar";
import { Table } from "../../src/components/Table";
import { Tabs } from "../../src/components/Tabs";
import { Tag, TagGroup } from "../../src/components/Tag";
import { TopNav } from "../../src/components/TopNav";

describe("Accordion", () => {
  it("titles are headings with buttons; Enter and Space open and close; one open at a time", async () => {
    render(<Accordion items={[{ id: "a", title: "First", content: "One" }, { id: "b", title: "Second", content: "Two" }]} defaultExpanded={["a"]} />);
    const first = screen.getByRole("button", { name: /First/ });
    const second = screen.getByRole("button", { name: /Second/ });
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
    expect(first.getAttribute("aria-expanded")).toBe("true");
    second.focus();
    await userEvent.keyboard("{Enter}");
    expect(second.getAttribute("aria-expanded")).toBe("true");
    expect(first.getAttribute("aria-expanded")).toBe("false");
    await userEvent.keyboard(" ");
    expect(second.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("Alert", () => {
  it("danger interrupts, the rest wait their turn; dismiss is named", async () => {
    const onDismiss = vi.fn();
    render(
      <>
        <Alert tone="danger" title="Could not read this file" onDismiss={onDismiss} />
        <Alert tone="info" title="Saved on this device" />
      </>,
    );
    expect(screen.getByRole("alert").textContent).toContain("Could not read");
    expect(screen.getByRole("status").textContent).toContain("Saved");
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe("Avatar, Kbd, Divider, Tag", () => {
  it("names people and agents, and hides an anonymous avatar", () => {
    const { container } = render(
      <>
        <Avatar name="Shreeraj Narwade" />
        <Avatar name="garu" kind="agent" />
        <Avatar />
      </>,
    );
    expect(screen.getByRole("img", { name: "Shreeraj Narwade" }).textContent).toBe("SN");
    expect(screen.getByRole("img", { name: "garu, AI" })).toBeTruthy();
    expect(container.querySelectorAll('[aria-hidden="true"].nk-avatar')).toHaveLength(1);
  });

  it("a key is a <kbd>, and drawn keys are named", () => {
    render(<Kbd>⌘</Kbd>);
    expect(screen.getByRole("img", { name: "Command" }).closest("kbd")).not.toBeNull();
  });

  it("dividers are separators, vertical ones say so", () => {
    render(
      <>
        <Divider />
        <Divider orientation="vertical" />
      </>,
    );
    const [h, v] = screen.getAllByRole("separator");
    expect(h!.tagName).toBe("HR");
    expect(v!.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("a removable tag goes with Delete", async () => {
    const onRemove = vi.fn();
    render(<TagGroup label="Categories" items={[{ id: "storage", label: "Storage" }, { id: "media", label: "Media" }]} onRemove={onRemove} />);
    expect(screen.getByRole("grid", { name: "Categories" })).toBeTruthy();
    await userEvent.tab();
    await userEvent.keyboard("{Delete}");
    expect(onRemove).toHaveBeenCalledWith(["storage"]);
    expect(screen.getByRole("button", { name: "Remove Media" })).toBeTruthy();
    render(<Tag tone="success" hasDot>Live</Tag>);
  });
});

describe("Breadcrumb, Link, Card, TopNav", () => {
  it("the last crumb is the current page, not a link", () => {
    render(<Breadcrumb items={[{ label: "Read", href: "/read" }, { label: "Ledger" }]} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(nav).getByRole("link", { name: "Read" }).getAttribute("href")).toBe("/read");
    expect(within(nav).getByText("Ledger").getAttribute("aria-current")).toBe("page");
  });

  it("an external link opens safely", () => {
    render(<Link href="https://example.org" isExternal>Notion</Link>);
    const a = screen.getByRole("link", { name: "Notion" });
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toBe("noreferrer");
  });

  it("a card is one link with a heading inside", () => {
    render(<Card href="/ledger" title="Ledger" code="RD-02" cta="Read the case study">A plain-language bank statement.</Card>);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/ledger");
    expect(within(link).getByRole("heading", { name: "Ledger" })).toBeTruthy();
  });

  it("the nav marks the current section; the phone menu says if it is open", () => {
    const { rerender } = render(<TopNav name="Shreeraj Narwade" items={[{ label: "Read", href: "/read", section: "read", isCurrent: true }, { label: "Build", href: "/build", section: "build" }]} />);
    expect(screen.getByRole("link", { name: /Read/ }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: /Build/ }).getAttribute("aria-current")).toBeNull();
    rerender(<TopNav name="Shreeraj Narwade" isCompact isMenuOpen={false} onMenu={() => {}} />);
    expect(screen.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")).toBe("false");
  });
});

describe("ProgressBar, Table, Tabs", () => {
  it("a progress bar reports its value", () => {
    render(<ProgressBar label="Reading the paper" value={42} />);
    const bar = screen.getByRole("progressbar", { name: "Reading the paper" });
    expect(bar.getAttribute("aria-valuenow")).toBe("42");
    expect(bar.getAttribute("aria-valuetext")).toBe("42%");
  });

  it("a table has column headers and a footer", () => {
    render(
      <Table
        label="Subscriptions"
        columns={[{ id: "merchant", label: "Merchant" }, { id: "amount", label: "Amount", isNumeric: true }]}
        rows={[{ id: "a", merchant: "Music", amount: "₹119.00" }]}
        footer={["Monthly total", "₹119.00"]}
      />,
    );
    const table = screen.getByRole("table", { name: "Subscriptions" });
    expect(within(table).getAllByRole("columnheader").map((c) => c.textContent)).toEqual(["Merchant", "Amount"]);
    expect(within(table).getByText("Monthly total").closest("tfoot")).not.toBeNull();
  });

  it("tabs: arrow keys move and select, disabled tabs are skipped", async () => {
    const onChange = vi.fn();
    render(
      <Tabs
        label="Sections"
        defaultSelectedKey="a"
        onSelectionChange={onChange}
        items={[{ id: "a", label: "Overview", content: "A" }, { id: "b", label: "Research", isDisabled: true, content: "B" }, { id: "c", label: "Process", content: "C" }]}
      />,
    );
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Overview" }));
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Process" }));
    expect(onChange).toHaveBeenLastCalledWith("c");
    expect(screen.getByRole("tabpanel").textContent).toBe("C");
  });
});
