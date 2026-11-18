import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Image } from "../../src/components/Image";
import { List, ListItem } from "../../src/components/ListItem";
import { Button } from "../../src/components/Button";

const SRC = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

describe("Image", () => {
  it("holds its ratio, loads lazily, and keeps its alt text; a caption makes it a figure", () => {
    render(<Image src={SRC} alt="Kitchen, north wall" ratio="3/2" caption="Before the tiles" />);
    const img = screen.getByRole("img", { name: "Kitchen, north wall" });
    expect(img.getAttribute("loading")).toBe("lazy");
    expect((img.parentElement as HTMLElement).style.aspectRatio).toBe("3/2");
    expect(screen.getByRole("figure").textContent).toContain("Before the tiles");
  });

  it("priority loads at once; a failed file says so in words", () => {
    render(<Image src={SRC} alt="Hero" ratio="16/10" priority />);
    const img = screen.getByRole("img", { name: "Hero" });
    expect(img.getAttribute("loading")).toBe("eager");
    fireEvent.error(img);
    expect(screen.getByText("Image did not load")).toBeTruthy();
    expect(img.parentElement?.getAttribute("data-state")).toBe("error");
  });

  it("zoomable is a button that opens the picture full size; Escape closes and focus returns", async () => {
    render(<Image src={SRC} alt="Living room" ratio="3/2" isZoomable zoomSrc="/full.jpg" />);
    const trigger = screen.getByRole("button", { name: "Living room, view full size" });
    await userEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Living room" });
    expect(dialog.querySelector("img")?.getAttribute("src")).toBe("/full.jpg");
    expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});

describe("ListItem", () => {
  it("is a list item with its title and meta; the picture is hidden from screen readers", () => {
    render(
      <List label="Worth a look">
        <ListItem media={<span>N</span>} title="Netflix" meta="₹649 a month" description="Went up from ₹499." />
      </List>,
    );
    const list = screen.getByRole("list", { name: "Worth a look" });
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(list.textContent).toContain("Netflix");
    expect(list.querySelector(".nk-listitem__media")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("with href the content is one link, and the actions are buttons outside it", () => {
    render(
      <List>
        <ListItem title="Invoice 0142" meta="Plumbing" trailing="₹48,000" href="/invoices/0142" actions={<Button size="sm">Download</Button>} />
      </List>,
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/invoices/0142");
    expect(link.textContent).toContain("Invoice 0142");
    expect(link.textContent).toContain("₹48,000");
    const action = screen.getByRole("button", { name: "Download" });
    expect(link.contains(action)).toBe(false);
  });
});
