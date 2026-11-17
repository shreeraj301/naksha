import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../../src/components/Button";
import { IconButton } from "../../src/components/IconButton";

describe("Button", () => {
  it("is a real button with its label as its name", () => {
    render(<Button variant="primary">Save changes</Button>);
    const b = screen.getByRole("button", { name: "Save changes" });
    expect(b.tagName).toBe("BUTTON");
    expect(b.getAttribute("type")).toBe("button");
    expect(b.className).toBe("nk-btn nk-btn--primary");
  });

  it("presses with the mouse, Enter and Space", async () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Save</Button>);
    const b = screen.getByRole("button");
    await userEvent.click(b);
    b.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onPress).toHaveBeenCalledTimes(3);
  });

  it("while pending: ignores presses, stays focusable, keeps its colour", async () => {
    const onPress = vi.fn();
    render(<Button variant="primary" isPending onPress={onPress}>Saving</Button>);
    const b = screen.getByRole("button", { name: "Saving" });
    expect(b.hasAttribute("data-pending")).toBe(true);
    expect(b.hasAttribute("disabled")).toBe(false);
    expect(b.querySelector(".nk-spin")).not.toBeNull();
    await userEvent.click(b);
    expect(onPress).not.toHaveBeenCalled();
    b.blur();
    await userEvent.tab();
    expect(document.activeElement).toBe(b);
  });

  it("does nothing when disabled", async () => {
    const onPress = vi.fn();
    render(<Button isDisabled onPress={onPress}>Save</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("marks the icon side so padding drops by 2px", () => {
    render(<><Button iconStart="plus">New note</Button><Button iconEnd="arrow-right">Read</Button></>);
    expect(screen.getByRole("button", { name: "New note" }).className).toContain("nk-btn--lead");
    expect(screen.getByRole("button", { name: "Read" }).className).toContain("nk-btn--trail");
  });

  it("takes layout overrides only", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Button styles={{ marginTop: 8, color: "red" } as never}>Save</Button>);
    const b = screen.getByRole("button");
    expect(b.style.marginTop).toBe("8px");
    expect(b.style.color).toBe("");
  });
});

describe("IconButton", () => {
  it("is named by its label, and its icon is hidden from assistive tech", () => {
    render(<IconButton label="Copy link" icon="link" />);
    const b = screen.getByRole("button", { name: "Copy link" });
    expect(b.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
