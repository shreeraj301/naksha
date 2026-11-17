import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const code = readFileSync("dist/artifact/components/bundle.js", "utf8");

describe("artifact bundle", () => {
  it("starts with the @ds-bundle header the artifact reads", () => {
    const header = JSON.parse(/^\/\* @ds-bundle: (.*) \*\/$/m.exec(code.split("\n")[0]!)![1]!);
    expect(header).toMatchObject({ format: 4, namespace: "Naksha" });
  });

  it("can be inlined in a page", () => {
    expect(code.toLowerCase()).not.toContain("</script");
    expect(code).not.toContain("<!--");
  });

  it("sets window.Naksha using the page's React", () => {
    const w: Record<string, unknown> = { React: {}, ReactDOM: {} };
    w.window = w;
    runInNewContext(code, w);
    expect(w.Naksha).toMatchObject({ version: expect.any(String) });
  });
});
