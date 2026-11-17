import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../../src/components/Button";
import { IconButton } from "../../src/components/IconButton";
import { DropdownMenu } from "../../src/components/DropdownMenu";
import { Modal, ModalTrigger } from "../../src/components/Modal";
import { Tooltip } from "../../src/components/Tooltip";
import { PromptLevel } from "../../src/components/PromptInput";
import { toast, Toaster } from "../../src/components/Toast";

describe("DropdownMenu", () => {
  const items = [
    { id: "copy", label: "Copy link", icon: "link" as const, shortcut: "⌘C" },
    { id: "rename", label: "Rename" },
    { id: "dup", label: "Duplicate", isDisabled: true },
    { separator: true as const },
    { id: "delete", label: "Delete", isDanger: true },
  ];

  it("opens from the keyboard with focus on the first item, acts on Enter, and returns focus", async () => {
    const onAction = vi.fn();
    render(<DropdownMenu label="Paper actions" trigger={<IconButton label="More" icon="ellipsis" />} items={items} onAction={onAction} />);
    const trigger = screen.getByRole("button", { name: "More" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    // In a trigger, React Aria names the menu by its trigger.
    const menu = screen.getByRole("menu", { name: "More" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: /Copy link/ }));
    expect(menu.querySelector('[role="separator"]')).not.toBeNull();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onAction).toHaveBeenCalledWith("rename");
    expect(screen.queryByRole("menu")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("skips disabled items and closes on Escape", async () => {
    render(<DropdownMenu label="Paper actions" trigger={<IconButton label="More" icon="ellipsis" />} items={items} />);
    const trigger = screen.getByRole("button", { name: "More" });
    trigger.focus();
    await userEvent.keyboard("{Enter}{ArrowDown}{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Delete" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("names drawn shortcut keys for screen readers", async () => {
    render(<DropdownMenu label="Paper actions" items={items} isInline />);
    expect(screen.getByRole("img", { name: "Command" })).toBeTruthy();
  });
});

describe("PromptLevel", () => {
  it("opens a menu of levels and reports the choice", async () => {
    const onChange = vi.fn();
    const options = [{ id: "simple", label: "Simple" }, { id: "everyday", label: "Everyday" }, { id: "informed", label: "Informed" }];
    render(<PromptLevel options={options} defaultValue="everyday" onChange={onChange} />);
    const trigger = screen.getByRole("button", { name: "Reading level: Everyday" });
    await userEvent.click(trigger);
    expect(screen.getByRole("menuitemradio", { name: "Everyday" }).getAttribute("aria-checked")).toBe("true");
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Simple" }));
    expect(onChange).toHaveBeenCalledWith("simple");
    expect(screen.getByRole("button", { name: "Reading level: Simple" })).toBeTruthy();
  });
});

describe("Modal", () => {
  function Example({ onAgree = () => {} }: { onAgree?: () => void }) {
    return (
      <>
        <ModalTrigger>
          <Button>Review change</Button>
          <Modal
            title="Agree to this change?"
            footer={(close) => (
              <>
                <Button onPress={close}>Not now</Button>
                <Button variant="primary" onPress={() => { onAgree(); close(); }}>Agree to this change</Button>
              </>
            )}
          >
            The rent moves up by 5% from 1 January.
          </Modal>
        </ModalTrigger>
        <button>Behind</button>
      </>
    );
  }

  it("moves focus in, is named by its title, and keeps Tab inside", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Review change" }));
    const dialog = screen.getByRole("dialog", { name: "Agree to this change?" });
    expect(dialog.contains(document.activeElement)).toBe(true);
    for (let i = 0; i < 6; i++) {
      await userEvent.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("Escape closes and focus returns to the trigger", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Review change" });
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("the footer gets close", async () => {
    const onAgree = vi.fn();
    render(<Example onAgree={onAgree} />);
    await userEvent.click(screen.getByRole("button", { name: "Review change" }));
    await userEvent.click(screen.getByRole("button", { name: "Agree to this change" }));
    expect(onAgree).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});

describe("Tooltip", () => {
  it("shows at once on keyboard focus, describes its trigger, and hides on Escape", async () => {
    render(
      <Tooltip content="Copy link" shortcut="⌘C">
        <IconButton label="Copy link" icon="link" />
      </Tooltip>,
    );
    await userEvent.tab();
    const tip = await screen.findByRole("tooltip");
    expect(tip.textContent).toContain("Copy link");
    expect(screen.getByRole("button", { name: "Copy link" }).getAttribute("aria-describedby")).toBe(tip.id);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  });
});

describe("toast", () => {
  afterEach(() => vi.useRealTimers());

  it("announces, leaves after 5 seconds, and pauses while hovered", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<Toaster />);
    act(() => void toast("Link copied"));
    const msg = await screen.findByText("Link copied");
    expect(screen.getByRole("region")).toBeTruthy();
    const host = document.querySelector(".nk-toaster-host")!;
    act(() => host.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })));
    await act(async () => void vi.advanceTimersByTime(6000));
    expect(msg.isConnected).toBe(true);
    act(() => host.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: document.body })));
    await act(async () => void vi.advanceTimersByTime(5500));
    await waitFor(() => expect(screen.queryByText("Link copied")).toBeNull());
  });

  it("a toast with an action stays until used, and using it closes it", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const undo = vi.fn();
    render(<Toaster />);
    act(() => void toast.success("Subscription cancelled", { action: { label: "Undo", onPress: undo } }));
    await screen.findByText("Subscription cancelled");
    await act(async () => void vi.advanceTimersByTime(20000));
    expect(screen.getByText("Subscription cancelled")).toBeTruthy();
    await act(async () => screen.getByRole("button", { name: "Undo" }).click());
    expect(undo).toHaveBeenCalled();
    await act(async () => void vi.advanceTimersByTime(300));
    await waitFor(() => expect(screen.queryByText("Subscription cancelled")).toBeNull());
  });

  it("dismiss fades it out before it leaves", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<Toaster />);
    let id = "";
    act(() => void (id = toast.error("Could not send.")));
    await screen.findByText("Could not send.");
    act(() => toast.dismiss(id));
    expect(document.querySelector(".nk-toast[data-removed]")).not.toBeNull();
    await act(async () => void vi.advanceTimersByTime(300));
    await waitFor(() => expect(screen.queryByText("Could not send.")).toBeNull());
  });
});
