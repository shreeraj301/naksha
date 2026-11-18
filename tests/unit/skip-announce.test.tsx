import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SkipLink } from "../../src/components/SkipLink";
import { announce } from "../../src/announce";

describe("SkipLink", () => {
  it("is the first Tab stop, and Enter moves focus to the main content without a ring round the page", async () => {
    render(
      <>
        <SkipLink />
        <nav><a href="#home">Home</a></nav>
        <main id="main"><button>Inside</button></main>
      </>,
    );
    await userEvent.tab();
    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(document.activeElement).toBe(link);
    expect(link.getAttribute("href")).toBe("#main");
    await userEvent.keyboard("{Enter}");
    const main = screen.getByRole("main");
    expect(document.activeElement).toBe(main);
    expect(main.getAttribute("tabindex")).toBe("-1");
    expect(main.hasAttribute("data-nk-skip-target")).toBe(true);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Inside" }));
  });

  it("takes another target and words, and keeps a tabindex the page set", async () => {
    render(
      <>
        <SkipLink target="results">Skip to results</SkipLink>
        <section id="results" tabIndex={0}>Results</section>
      </>,
    );
    await userEvent.click(screen.getByRole("link", { name: "Skip to results" }));
    const target = document.getElementById("results")!;
    expect(document.activeElement).toBe(target);
    expect(target.getAttribute("tabindex")).toBe("0");
  });
});

describe("announce", () => {
  afterEach(() => vi.useRealTimers());

  it("says a message in a polite log after the region exists, again when repeated, and clears it after 7 seconds", () => {
    vi.useFakeTimers();
    const focused = document.createElement("button");
    document.body.append(focused);
    focused.focus();
    announce("Draft saved.");
    const polite = document.querySelector('[data-nk-announcer] [aria-live="polite"]')!;
    expect(polite.getAttribute("role")).toBe("log");
    vi.advanceTimersByTime(100);
    expect(polite.textContent).toBe("Draft saved.");
    announce("Draft saved.");
    expect(polite.children).toHaveLength(2);
    expect(document.activeElement).toBe(focused);
    vi.advanceTimersByTime(7000);
    expect(polite.children).toHaveLength(0);
  });

  it("interrupt uses the assertive log; an empty message says nothing", () => {
    vi.useFakeTimers();
    announce("Could not send.", { interrupt: true });
    vi.advanceTimersByTime(100);
    const assertive = document.querySelector('[data-nk-announcer] [aria-live="assertive"]')!;
    expect(assertive.textContent).toContain("Could not send.");
    announce("   ");
    expect(document.querySelectorAll("[data-nk-announcer]")).toHaveLength(1);
  });
});
