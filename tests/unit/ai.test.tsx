import { describe, it, expect, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Thread } from "../../src/components/Thread";
import { ChatMessage, Generated } from "../../src/components/ChatMessage";
import { ResponseStatus } from "../../src/components/ResponseStatus";
import { SourceChip, Cite } from "../../src/components/SourceChip";
import { SuggestionChip } from "../../src/components/SuggestionChip";

const flushFrames = () => act(async () => void (await new Promise((r) => setTimeout(r, 50))));

describe("Thread", () => {
  function Conversation({ state = "done" as "done" | "streaming", reply = "the rent can rise once a year." }) {
    return (
      <>
        <button>Before</button>
        <Thread label="Conversation with garu" isBusy={state === "streaming"}>
          <ChatMessage from="user">Explain clause 4.2</ChatMessage>
          <ChatMessage from="assistant" name="garu" state={state}>
            {reply}
          </ChatMessage>
          <ChatMessage from="user">And the deposit?</ChatMessage>
        </Thread>
        <button>After</button>
      </>
    );
  }

  it("is one Tab stop; arrow keys, Home and End move between messages", async () => {
    render(<Conversation />);
    const feed = screen.getByRole("feed", { name: "Conversation with garu" });
    const [first, second, third] = screen.getAllByRole("article");
    await userEvent.tab();
    await userEvent.tab();
    expect(document.activeElement, "Tab lands on the newest message").toBe(third);
    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(second);
    expect(second!.getAttribute("aria-label")).toBe("garu said");
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toBe(first);
    expect(first!.getAttribute("aria-posinset")).toBe("1");
    expect(first!.getAttribute("aria-setsize")).toBe("3");
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe(third);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "After" }));
    expect(feed.getAttribute("aria-busy")).toBeNull();
  });

  it("announces a reply once, when it finishes, not while it streams", async () => {
    const { rerender, container } = render(<Conversation state="streaming" reply="the rent" />);
    const live = container.querySelector('[aria-live="polite"]')!;
    expect(screen.getByRole("feed").getAttribute("aria-busy")).toBe("true");
    rerender(<Conversation state="streaming" reply="the rent can rise" />);
    await flushFrames();
    expect(live.textContent).toBe("");
    rerender(<Conversation state="done" reply="the rent can rise once a year." />);
    await flushFrames();
    expect(live.textContent).toContain("garu: garu");
    expect(live.textContent).toContain("the rent can rise once a year.");
  });
});

describe("ChatMessage", () => {
  it("names sources by number, and the actions by what they do", async () => {
    const onFeedback = vi.fn();
    render(
      <ChatMessage
        from="assistant"
        name="garu"
        sources={[{ label: "Schedule A, clause 4.2", onPress: () => {} }]}
        onCopy={() => {}}
        feedback="good"
        onFeedback={onFeedback}
        onRetry={() => {}}
      >
        {["the rent can rise by 5%.", <Cite key="c" n={1} />]}
      </ChatMessage>,
    );
    expect(screen.getByRole("button", { name: /^Source\s*1\s*:\s*Schedule A, clause 4\.2$/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Good answer" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Bad answer" }).getAttribute("aria-pressed")).toBe("false");
    await userEvent.click(screen.getByRole("button", { name: "Bad answer" }));
    expect(onFeedback).toHaveBeenCalledWith("bad");
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
  });

  it("while streaming: names the running step, hides sources and actions", () => {
    render(
      <ChatMessage
        from="assistant"
        name="garu"
        state="streaming"
        steps={[{ label: "Reading the lease", status: "done" }, { label: "Comparing clauses", status: "running" }]}
        sources={[{ label: "Page 3" }]}
        onCopy={() => {}}
      >
        clause 4.2 lets
      </ChatMessage>,
    );
    expect(document.querySelector(".nk-msg__status")!.textContent).toBe("Comparing clauses");
    expect(document.querySelector(".nk-msg__caret")).not.toBeNull();
    expect(screen.queryByRole("button", { name: /Source/ })).toBeNull();
    expect(screen.queryByRole("button", { name: "Copy" })).toBeNull();
  });

  it("a failed reply says what happened and offers Try again", async () => {
    const onRetry = vi.fn();
    render(<ChatMessage from="assistant" name="garu" state="error" error="garu lost the thread halfway." onRetry={onRetry} />);
    expect(screen.getByText(/lost the thread/)).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("a person's turn can be edited", async () => {
    const onEdit = vi.fn();
    render(<ChatMessage from="user" onEdit={onEdit}>Explain clause 4.2</ChatMessage>);
    expect(screen.getByRole("article", { name: "You said" })).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Edit message" }));
    expect(onEdit).toHaveBeenCalled();
  });

  it("generated content is a captioned figure with its own copy", () => {
    render(
      <Generated title="Draft reply to the landlord" onCopy={() => {}}>
        <p>Dear Mr Rao,</p>
      </Generated>,
    );
    expect(screen.getByRole("figure", { name: "Draft reply to the landlord" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Copy Draft reply to the landlord" })).toBeTruthy();
  });
});

describe("ResponseStatus", () => {
  it("toggles the trace and says each step's state in words", async () => {
    render(<ResponseStatus steps={[{ label: "Reading the lease", status: "done" }, { label: "Checking the act", status: "failed" }, { label: "Writing", status: "pending" }]} />);
    const toggle = screen.getByRole("button", { name: /1 of 3 steps, 1 failed/ });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    await userEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    const items = screen.getAllByRole("listitem").map((li) => li.textContent?.trim());
    expect(items).toEqual(["Reading the lease, done", "Checking the act, failed", "Writing, waiting"]);
  });
});

describe("SourceChip and SuggestionChip", () => {
  it("a source with an href is a link", () => {
    render(<SourceChip n={3} label="gov.in/rent-act" href="https://example.org" />);
    expect(screen.getByRole("link", { name: /^Source\s*3\s*:\s*gov\.in\/rent-act$/ })).toBeTruthy();
  });

  it("a suggestion sends on press, and not when disabled", async () => {
    const onPress = vi.fn();
    const { rerender } = render(<SuggestionChip onPress={onPress}>Explain clause 4.2</SuggestionChip>);
    await userEvent.click(screen.getByRole("button", { name: "Explain clause 4.2" }));
    expect(onPress).toHaveBeenCalledTimes(1);
    rerender(<SuggestionChip onPress={onPress} isDisabled>Explain clause 4.2</SuggestionChip>);
    await userEvent.click(screen.getByRole("button", { name: "Explain clause 4.2" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
