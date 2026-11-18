import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleButton } from "../../src/components/ToggleButton";
import { CopyButton } from "../../src/components/CopyButton";

describe("ToggleButton", () => {
  it("is a button that says whether it is pressed; Space and a click turn it on and off; the label never changes", async () => {
    const onChange = vi.fn();
    render(<ToggleButton onChange={onChange}>Sound</ToggleButton>);
    const b = screen.getByRole("button", { name: "Sound" });
    expect(b.getAttribute("aria-pressed")).toBe("false");
    await userEvent.click(b);
    expect(b.getAttribute("aria-pressed")).toBe("true");
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("button", { name: "Sound" })).toBe(b);
    b.focus();
    await userEvent.keyboard(" ");
    expect(b.getAttribute("aria-pressed")).toBe("false");
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("icon only takes its name from label; controlled state follows isSelected", async () => {
    const { rerender } = render(<ToggleButton icon="sparkles" label="Agent view" isSelected={false} onChange={() => {}} />);
    const b = screen.getByRole("button", { name: "Agent view" });
    expect(b.getAttribute("aria-pressed")).toBe("false");
    expect(b.className).toContain("nk-iconbtn");
    rerender(<ToggleButton icon="sparkles" label="Agent view" isSelected onChange={() => {}} />);
    expect(b.getAttribute("aria-pressed")).toBe("true");
  });

  it("a disabled toggle does not change", async () => {
    render(<ToggleButton isDisabled defaultSelected>Night</ToggleButton>);
    const b = screen.getByRole("button", { name: "Night" });
    await userEvent.click(b);
    expect(b.getAttribute("aria-pressed")).toBe("true");
  });
});

describe("CopyButton", () => {
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
  const clipboard = (impl: (t: string) => Promise<void>) => {
    const writeText = vi.fn(impl);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    return writeText;
  };

  it("copies the value, says Copied for two seconds without losing its place, and announces it", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const writeText = clipboard(() => Promise.resolve());
    const onCopy = vi.fn();
    render(<CopyButton value="https://example.com/approve/7q2xk" announcement="Approval link copied." onCopy={onCopy}>Copy link</CopyButton>);
    await userEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(writeText).toHaveBeenCalledWith("https://example.com/approve/7q2xk");
    expect(onCopy).toHaveBeenCalledWith("https://example.com/approve/7q2xk");
    await waitFor(() => expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy());
    expect(screen.getByRole("status").textContent).toBe("Approval link copied.");
    act(() => { vi.advanceTimersByTime(2100); });
    expect(screen.getByRole("button", { name: "Copy link" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("a function value is read at the moment of the press", async () => {
    const writeText = clipboard(() => Promise.resolve());
    let token = "a";
    render(<CopyButton value={() => `https://example.com/${token}`}>Copy link</CopyButton>);
    token = "b";
    await userEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(writeText).toHaveBeenCalledWith("https://example.com/b");
  });

  it("when the browser refuses, the value appears in a labelled read-only field with focus, ready to copy by hand", async () => {
    clipboard(() => Promise.reject(new Error("denied")));
    render(<CopyButton value="https://example.com/approve/7q2xk" valueLabel="Approval link">Copy link</CopyButton>);
    await userEvent.click(screen.getByRole("button", { name: "Copy link" }));
    const field = await screen.findByRole("textbox", { name: "Approval link" });
    expect((field as HTMLInputElement).value).toBe("https://example.com/approve/7q2xk");
    expect((field as HTMLInputElement).readOnly).toBe(true);
    await waitFor(() => expect(document.activeElement).toBe(field));
    expect(screen.getByText(/did not allow copying/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Copy link" })).toBeTruthy();
  });

  it("icon only is named by its label", async () => {
    clipboard(() => Promise.resolve());
    render(<CopyButton value="npx github:shreeraj301/naksha init-agents ." isIconOnly>Copy command</CopyButton>);
    await userEvent.click(screen.getByRole("button", { name: "Copy command" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy());
  });
});
