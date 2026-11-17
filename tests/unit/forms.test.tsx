import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../../src/components/Input";
import { Textarea } from "../../src/components/Textarea";
import { Select } from "../../src/components/Select";
import { Checkbox } from "../../src/components/Checkbox";
import { RadioGroup, Radio } from "../../src/components/Radio";
import { Switch } from "../../src/components/Switch";
import { SegmentedControl } from "../../src/components/SegmentedControl";

const describedBy = (el: HTMLElement) =>
  (el.getAttribute("aria-describedby") ?? "").split(" ").filter(Boolean).map((id) => document.getElementById(id)?.textContent).join(" | ");

describe("Input", () => {
  it("is labelled by its visible label and described by its help", () => {
    render(<Input label="Email" type="email" description="We only use this to reply." />);
    const box = screen.getByLabelText("Email");
    expect(box.getAttribute("type")).toBe("email");
    expect(describedBy(box)).toBe("We only use this to reply.");
  });

  it("an error replaces the help, with aria-invalid, and the field turns red", () => {
    const { container } = render(<Input label="Email" description="We only use this to reply." isInvalid errorMessage="Add the part after the dot." />);
    const box = screen.getByLabelText("Email");
    expect(box.getAttribute("aria-invalid")).toBe("true");
    expect(describedBy(box)).toBe("Add the part after the dot.");
    expect(container.querySelector(".nk-field")!.className).toContain("nk-field--error");
    expect(screen.queryByText("We only use this to reply.")).toBeNull();
  });

  it("reports typing and marks optional fields", async () => {
    const onChange = vi.fn();
    render(<Input label="Name" isOptional onChange={onChange} />);
    expect(screen.getByText("Optional")).toBeTruthy();
    await userEvent.type(screen.getByRole("textbox", { name: /Name/ }), "Ada");
    expect(onChange).toHaveBeenLastCalledWith("Ada");
  });

  it("disabled means disabled", () => {
    render(<Input label="Email" isDisabled defaultValue="a@b.co" />);
    expect((screen.getByLabelText("Email") as HTMLInputElement).disabled).toBe(true);
  });
});

describe("Textarea", () => {
  it("counts characters and tells screen readers the limit", async () => {
    render(<Textarea label="Paste the paper" maxLength={6000} description="We never store what you paste." />);
    const area = screen.getByLabelText("Paste the paper");
    expect(area.getAttribute("maxlength")).toBe("6000");
    expect(describedBy(area)).toBe("We never store what you paste. | 0 / 6,000");
    await userEvent.type(area, "Hi!");
    expect(screen.getByText("3 / 6,000")).toBeTruthy();
  });

  it("announces the last 10% and the limit once each, not every keystroke", async () => {
    const { container } = render(<Textarea label="Note" maxLength={20} />);
    const live = container.querySelector('[aria-live="polite"]')!;
    const area = screen.getByLabelText("Note");
    await userEvent.type(area, "a".repeat(17));
    expect(live.textContent).toBe("");
    await userEvent.type(area, "a");
    expect(live.textContent).toBe("2 characters left");
    await userEvent.type(area, "a");
    expect(live.textContent).toBe("2 characters left");
    await userEvent.type(area, "aaa");
    expect(live.textContent).toBe("Character limit reached");
    expect(container.querySelector(".nk-count--full")).not.toBeNull();
  });
});

describe("Select", () => {
  const options = [
    { id: "simple", label: "Simple" },
    { id: "everyday", label: "Everyday" },
    { id: "informed", label: "Informed" },
  ];

  it("opens from the keyboard, moves with arrows and chooses with Enter", async () => {
    const onChange = vi.fn();
    render(<Select label="Reading level" options={options} defaultValue="everyday" onChange={onChange} />);
    const trigger = screen.getByRole("button", { name: /Reading level/ });
    expect(trigger.textContent).toContain("Everyday");
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    const list = screen.getByRole("listbox");
    expect(within(list).getAllByRole("option").map((o) => o.textContent)).toEqual(["Simple", "Everyday", "Informed"]);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("informed");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(trigger.textContent).toContain("Informed");
  });

  it("typing a letter on the closed trigger picks the matching option", async () => {
    const onChange = vi.fn();
    render(<Select label="Reading level" options={options} defaultValue="simple" onChange={onChange} />);
    screen.getByRole("button", { name: /Reading level/ }).focus();
    await userEvent.keyboard("i");
    expect(onChange).toHaveBeenLastCalledWith("informed");
  });

  it("shows the placeholder until something is chosen", () => {
    const { container } = render(<Select label="Reading level" options={options} placeholder="Choose a level" />);
    const value = container.querySelector(".nk-control__value")!;
    expect(value.textContent).toBe("Choose a level");
    expect(value.hasAttribute("data-placeholder")).toBe(true);
  });
});

describe("Checkbox", () => {
  it("toggles with a click and with Space", async () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>Weekly digest</Checkbox>);
    const box = screen.getByRole("checkbox", { name: "Weekly digest" });
    await userEvent.click(box);
    expect(onChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard(" ");
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("indeterminate is real, not only drawn", () => {
    render(<Checkbox isIndeterminate>All papers</Checkbox>);
    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true);
  });
});

describe("RadioGroup", () => {
  it("is one tab stop; arrow keys move the choice", async () => {
    const onChange = vi.fn();
    render(
      <>
        <RadioGroup label="Reading level" defaultValue="everyday" onChange={onChange}>
          <Radio value="simple">Simple</Radio>
          <Radio value="everyday">Everyday</Radio>
          <Radio value="informed">Informed</Radio>
        </RadioGroup>
        <button>After</button>
      </>,
    );
    expect(screen.getByRole("radiogroup", { name: "Reading level" })).toBeTruthy();
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Everyday" }));
    await userEvent.keyboard("{ArrowDown}");
    expect(onChange).toHaveBeenLastCalledWith("informed");
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "After" }));
  });
});

describe("Switch", () => {
  it("is a switch and flips with Space", async () => {
    const onChange = vi.fn();
    render(<Switch onChange={onChange}>Agent view</Switch>);
    const s = screen.getByRole("switch", { name: "Agent view" });
    s.focus();
    await userEvent.keyboard(" ");
    expect(onChange).toHaveBeenLastCalledWith(true);
  });
});

describe("SegmentedControl", () => {
  it("is a named radio group with one option on", async () => {
    const onChange = vi.fn();
    render(<SegmentedControl label="View" options={[{ id: "human", label: "Human" }, { id: "agent", label: "Agent" }]} defaultValue="human" onChange={onChange} />);
    expect(screen.getByRole("radiogroup", { name: "View" })).toBeTruthy();
    expect((screen.getByRole("radio", { name: "Human" }) as HTMLInputElement).checked).toBe(true);
    await userEvent.click(screen.getByRole("radio", { name: "Agent" }));
    expect(onChange).toHaveBeenLastCalledWith("agent");
    // Pressing the option that is already on keeps it on: there is always one choice.
    await userEvent.click(screen.getByRole("radio", { name: "Agent" }));
    expect((screen.getByRole("radio", { name: "Agent" }) as HTMLInputElement).checked).toBe(true);
  });

  it("Tab lands on the chosen option; arrow keys move the choice, like a radio group", async () => {
    const onChange = vi.fn();
    render(
      <>
        <SegmentedControl label="View" options={[{ id: "day", label: "Day" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }]} defaultValue="week" onChange={onChange} />
        <button>After</button>
      </>,
    );
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Week" }));
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Month" }));
    expect(onChange).toHaveBeenLastCalledWith("month");
    expect((screen.getByRole("radio", { name: "Month" }) as HTMLInputElement).checked).toBe(true);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "After" }));
  });
});
