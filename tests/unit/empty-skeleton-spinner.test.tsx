import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "../../src/components/EmptyState";
import { Skeleton } from "../../src/components/Skeleton";
import { Spinner } from "../../src/components/Spinner";

describe("EmptyState", () => {
  it("says what will appear, how to fill it, and offers the one action", () => {
    const { container } = render(
      <EmptyState title="No subscriptions yet" code="Nothing drawn here yet" action={<button>Add one</button>}>
        Add the first one and it shows up here.
      </EmptyState>,
    );
    expect(screen.getByText("No subscriptions yet")).toBeTruthy();
    expect(screen.getByText("Nothing drawn here yet")).toBeTruthy();
    expect(screen.getByText("Add the first one and it shows up here.").tagName).toBe("P");
    expect(screen.getByRole("button", { name: "Add one" })).toBeTruthy();
    // The icon is decoration: screen readers get the words only.
    expect(container.querySelector(".nk-empty__well svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("leaves out the code line and the sentence when they are not given", () => {
    const { container } = render(<EmptyState title="Empty" />);
    expect(container.querySelector(".nk-empty__code")).toBeNull();
    expect(container.querySelector("p")).toBeNull();
  });
});

describe("Skeleton", () => {
  it("is hidden from screen readers and turns px numbers into rem", () => {
    const { container } = render(<Skeleton width={160} height={24} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.style.width).toBe("10rem");
    expect(el.style.height).toBe("1.5rem");
  });

  it("keeps a string length as given, and draws a circle when asked", () => {
    const { container } = render(<Skeleton width="60%" shape="circle" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe("60%");
    expect(el.classList.contains("nk-skel--circle")).toBe(true);
  });
});

describe("Spinner", () => {
  it("is decoration without a label", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("role")).toBeNull();
  });

  it("is an image named by its label when it is the only sign of work", () => {
    render(<Spinner label="Loading invoices" />);
    expect(screen.getByRole("img", { name: "Loading invoices" })).toBeTruthy();
  });

  it("takes the small and large sizes", () => {
    const { container, rerender } = render(<Spinner size="sm" />);
    expect(container.querySelector("svg")!.classList.contains("nk-spin--sm")).toBe(true);
    rerender(<Spinner size="lg" />);
    expect(container.querySelector("svg")!.classList.contains("nk-spin--lg")).toBe(true);
  });
});
