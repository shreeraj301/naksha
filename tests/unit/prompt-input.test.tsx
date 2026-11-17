import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { PromptInput, PromptLevel } from "../../src/components/PromptInput";

const base = { label: "Message garu", placeholder: "Ask garu about this paper" };

describe("PromptInput", () => {
  it("sends on Enter and keeps a new line on Shift+Enter", async () => {
    const onSubmit = vi.fn();
    render(<PromptInput {...base} onSubmit={onSubmit} />);
    const box = screen.getByRole("textbox", { name: "Message garu" });
    await userEvent.type(box, "Explain clause 4.2");
    await userEvent.keyboard("{Shift>}{Enter}{/Shift}");
    expect(onSubmit).not.toHaveBeenCalled();
    expect((box as HTMLTextAreaElement).value).toBe("Explain clause 4.2\n");
    await userEvent.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("Explain clause 4.2\n");
  });

  it("never sends while an input method is composing (Hindi, Marathi, Japanese)", () => {
    const onSubmit = vi.fn();
    render(<PromptInput {...base} defaultValue="नमस" onSubmit={onSubmit} />);
    const box = screen.getByRole("textbox");
    fireEvent.keyDown(box, { key: "Enter", isComposing: true });
    fireEvent.keyDown(box, { key: "Enter", keyCode: 229 });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.keyDown(box, { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledWith("नमस");
  });

  it("keeps send disabled until there is text", async () => {
    render(<PromptInput {...base} onSubmit={() => {}} />);
    const send = screen.getByRole("button", { name: "Send" });
    expect(send.hasAttribute("disabled")).toBe(true);
    await userEvent.type(screen.getByRole("textbox"), "   ");
    expect(send.hasAttribute("disabled")).toBe(true);
    await userEvent.type(screen.getByRole("textbox"), "hi");
    expect(send.hasAttribute("disabled")).toBe(false);
  });

  it("turns send into stop while generating, and stop always works", async () => {
    const onStop = vi.fn();
    const onSubmit = vi.fn();
    render(<PromptInput {...base} defaultValue="Explain" isGenerating onStop={onStop} onSubmit={onSubmit} />);
    expect(screen.queryByRole("button", { name: "Send" })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Stop generating" }));
    expect(onStop).toHaveBeenCalledOnce();
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows attach and dictate only when the product handles them", () => {
    const { rerender } = render(<PromptInput {...base} />);
    expect(screen.queryByRole("button", { name: "Attach a file" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Dictate" })).toBeNull();
    rerender(<PromptInput {...base} onAddFiles={() => {}} onDictate={() => {}} />);
    expect(screen.getByRole("button", { name: "Attach a file" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Dictate" })).toBeTruthy();
  });

  it("lists attachments with a named remove button", async () => {
    const onRemove = vi.fn();
    render(<PromptInput {...base} attachments={[{ id: "a", name: "Lease_2026.pdf", meta: "4 pages" }]} onRemoveAttachment={onRemove} />);
    expect(screen.getByText("Lease_2026.pdf", { exact: false })).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Remove Lease_2026.pdf" }));
    expect(onRemove).toHaveBeenCalledWith("a");
  });

  it("works controlled", async () => {
    function Controlled() {
      const [v, setV] = useState("");
      return <><PromptInput {...base} value={v} onChange={setV} /><output>{v.toUpperCase()}</output></>;
    }
    render(<Controlled />);
    await userEvent.type(screen.getByRole("textbox"), "ask");
    expect(screen.getByRole("status").textContent).toBe("ASK");
  });

  it("puts the steering control beside send", () => {
    const options = [{ id: "simple", label: "Simple" }, { id: "everyday", label: "Everyday" }];
    render(<PromptInput {...base} level={<PromptLevel options={options} defaultValue="everyday" />} />);
    const level = screen.getByRole("button", { name: "Reading level: Everyday" });
    expect(level.getAttribute("aria-haspopup")).toBe("true");
    expect(level.nextElementSibling?.getAttribute("aria-label")).toBe("Send");
  });
});
