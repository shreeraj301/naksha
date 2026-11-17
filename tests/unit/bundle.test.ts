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

  it("sets window.Naksha using the page's React 18.3.1", () => {
    const w: Record<string, unknown> = {};
    w.window = w;
    w.self = w;
    w.globalThis = w;
    for (const lib of ["react.production.min.js", "react-dom.production.min.js"]) {
      runInNewContext(readFileSync(`dist/artifact/components/lib/${lib}`, "utf8"), w);
    }
    runInNewContext(code, w);
    const N = w.Naksha as Record<string, unknown>;
    expect(N).toMatchObject({ version: expect.any(String) });
    for (const c of JSON.parse(readFileSync("src/components.json", "utf8"))) expect(typeof N[c], c).not.toBe("undefined");
  });
});
