import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";

// The website gates: axe at every severity, reduced-motion screenshots and clipped-text checks, and reflow at 320px,
// on every page of the static export in site/out. Build the site first (cd site && npm run build).
process.env.FONTCONFIG_FILE = resolve("tests/visual/fonts.conf");
const PORT = 4410;

export default defineConfig({
  testDir: "tests/site",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  reporter: [["list"]],
  expect: { toHaveScreenshot: { maxDiffPixels: 4, threshold: 0.1, animations: "disabled", caret: "hide" } },
  webServer: {
    command: "node site/scripts/serve.mjs",
    env: { PORT: String(PORT) },
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: false,
  },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    deviceScaleFactor: 1,
    launchOptions: { args: ["--font-render-hinting=none"] },
  },
});
