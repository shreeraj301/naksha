import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  reporter: [["list"]],
  expect: { toHaveScreenshot: { maxDiffPixels: 4, threshold: 0.1, animations: "disabled", caret: "hide" } },
  use: { deviceScaleFactor: 1, colorScheme: "light" },
});
