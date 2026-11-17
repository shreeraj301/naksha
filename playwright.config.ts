import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";

// Same font rendering on every Linux machine (see tests/visual/fonts.conf).
process.env.FONTCONFIG_FILE = resolve("tests/visual/fonts.conf");

export default defineConfig({
  testDir: "tests/visual",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  reporter: [["list"]],
  // Local runs are strict: 4 pixels may differ. Text antialiasing differs slightly between machines (CPU-specific
  // rasterising), so CI compares with a colour tolerance that ignores antialiasing but still catches a missing
  // dot, edge or colour. The strict check runs before every change; CI guards against large regressions.
  expect: {
    toHaveScreenshot: process.env.CI
      ? { maxDiffPixelRatio: 0.002, threshold: 0.3, animations: "disabled", caret: "hide" }
      : { maxDiffPixels: 4, threshold: 0.1, animations: "disabled", caret: "hide" },
  },
  use: { deviceScaleFactor: 1, colorScheme: "light" },
});
