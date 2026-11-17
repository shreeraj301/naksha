import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";

// Only Inter is visible as a system font, for the few glyphs no Naksha font has (see tests/visual/fonts.conf).
process.env.FONTCONFIG_FILE = resolve("tests/visual/fonts.conf");

export default defineConfig({
  testDir: "tests/visual",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  reporter: [["list"]],
  // One strict check everywhere: 4 pixels may differ.
  expect: { toHaveScreenshot: { maxDiffPixels: 4, threshold: 0.1, animations: "disabled", caret: "hide" } },
  use: {
    deviceScaleFactor: 1,
    colorScheme: "light",
    // Headless Chromium picks its font hinting per machine. Hinted glyphs get whole-pixel advances, so the same
    // 12px mono line came out 2% narrower on GitHub's runners. Fixing it to "none" gives every machine the same layout.
    launchOptions: { args: ["--font-render-hinting=none"] },
  },
});
