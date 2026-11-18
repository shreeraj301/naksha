import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Slider } from "../../src/components/Slider";
import { Drawer, DrawerTrigger } from "../../src/components/Drawer";
import { Button } from "../../src/components/Button";

describe("Slider", () => {
  it("is a range named by its label; arrow keys step, Home and End jump, and onChangeEnd fires once per key", async () => {
    const onChange = vi.fn();
    const onChangeEnd = vi.fn();
    render(<Slider label="Volume" defaultValue={40} step={5} onChange={onChange} onChangeEnd={onChangeEnd} />);
    const input = screen.getByRole("slider", { name: "Volume" });
    expect((input as HTMLInputElement).value).toBe("40");
    input.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith(45);
    expect(onChangeEnd).toHaveBeenLastCalledWith(45);
    await userEvent.keyboard("{End}");
    expect((input as HTMLInputElement).value).toBe("100");
    await userEvent.keyboard("{Home}");
    expect((input as HTMLInputElement).value).toBe("0");
  });

  it("writes and speaks the value the same way, from formatOptions", () => {
    render(<Slider label="Volume" defaultValue={0.4} maxValue={1} step={0.01} formatOptions={{ style: "percent" }} />);
    const input = screen.getByRole("slider", { name: "Volume" });
    expect(input.getAttribute("aria-valuetext")).toBe("40%");
    expect(document.querySelector(".nk-slider__value")?.textContent).toBe("40%");
  });

  it("formatValue writes a clock time, shown and spoken, over formatOptions", async () => {
    const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} of 3:40`;
    render(<Slider label="Playback position" defaultValue={83} maxValue={220} formatValue={clock} formatOptions={{ style: "percent" }} />);
    const input = screen.getByRole("slider", { name: "Playback position" });
    expect(input.getAttribute("aria-valuetext")).toBe("1:23 of 3:40");
    expect(document.querySelector(".nk-slider__value")?.textContent).toBe("1:23 of 3:40");
    input.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(input.getAttribute("aria-valuetext")).toBe("1:24 of 3:40");
  });

  it("the label points at the input, and onChange gets a number even with no value given", async () => {
    const onChange = vi.fn();
    render(<Slider label="Volume" onChange={onChange} />);
    const input = screen.getByRole("slider", { name: "Volume" });
    expect(document.querySelector("label")?.getAttribute("for")).toBe(input.id);
    expect((input as HTMLInputElement).value).toBe("0");
    input.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it("showValue={false} hides the written value but not the spoken one; disabled does not move", async () => {
    render(<Slider label="Position" defaultValue={10} showValue={false} isDisabled />);
    expect(document.querySelector(".nk-slider__value")).toBeNull();
    const input = screen.getByRole("slider", { name: "Position" });
    expect(input.getAttribute("aria-valuetext")).toBe("10");
    expect((input as HTMLInputElement).disabled).toBe(true);
  });
});

describe("Drawer", () => {
  function Example({ onCreate = () => {} }: { onCreate?: () => void }) {
    return (
      <>
        <DrawerTrigger>
          <Button>New project</Button>
          <Drawer
            title="New project"
            footer={(close) => (
              <>
                <Button onPress={close}>Cancel</Button>
                <Button variant="primary" onPress={() => { onCreate(); close(); }}>Create project</Button>
              </>
            )}
          >
            <button>Inside</button>
          </Drawer>
        </DrawerTrigger>
        <button>Behind</button>
      </>
    );
  }

  it("is a dialog named by its title; focus moves in and Tab stays inside", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "New project" }));
    const dialog = screen.getByRole("dialog", { name: "New project" });
    expect(dialog.contains(document.activeElement)).toBe(true);
    for (let i = 0; i < 6; i++) {
      await userEvent.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("Escape closes and focus returns to the trigger; the footer gets close", async () => {
    const onCreate = vi.fn();
    render(<Example onCreate={onCreate} />);
    const trigger = screen.getByRole("button", { name: "New project" });
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("button", { name: "Create project" }));
    expect(onCreate).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("side start puts the overlay on the start edge", async () => {
    render(<Drawer title="Index" defaultOpen side="start" isDismissable>Links</Drawer>);
    const dialog = screen.getByRole("dialog", { name: "Index" });
    expect(dialog.className).toContain("nk-drawer--start");
    expect(document.querySelector(".nk-overlay--start")).not.toBeNull();
  });
});
