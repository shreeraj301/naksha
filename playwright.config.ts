import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";

// Same font rendering on every Linux machine (see tests/visual/fonts.conf).
process.env.FONTCONFIG_FILE = resolve("tests/visual/fonts.conf");

export default defineConfig({
  testDir: "tests/visual",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  reporter: [["list"]],
  expect: { toHaveScreenshot: { maxDiffPixels: 4, threshold: 0.1, animations: "disabled", caret: "hide" } },
  use: { deviceScaleFactor: 1, colorScheme: "light" },
});
