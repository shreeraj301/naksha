import { describe, it, expect, vi } from "vitest";
import { layoutStyle, LAYOUT_PROPERTIES } from "../../src/styles";

describe("layoutStyle", () => {
  it("keeps layout properties", () => {
    expect(layoutStyle({ marginTop: 8, width: "100%", gridColumn: "1 / 3" })).toEqual({ marginTop: 8, width: "100%", gridColumn: "1 / 3" });
  });

  it("drops anything that changes how a component looks, and says so", () => {
    vi.stubEnv("NODE_ENV", "development"); // some machines set NODE_ENV=production globally
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const out = layoutStyle({ margin: 4, color: "red", padding: 12, background: "blue" } as never);
    expect(out).toEqual({ margin: 4 });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("color, padding, background"));
    vi.unstubAllEnvs();
  });

  it("stays quiet in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(layoutStyle({ color: "red" } as never)).toEqual({});
    expect(warn).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });

  it("allows no colour, type, border or padding property", () => {
    for (const p of LAYOUT_PROPERTIES) expect(p).not.toMatch(/color|background|font|border|padding|shadow|outline|radius/i);
  });
});
