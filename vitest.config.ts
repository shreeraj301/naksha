import { defineConfig } from "vitest/config";

// Some machines set NODE_ENV=production globally, which makes React load its production build, where act() does
// not exist. Tests always run against the development build.
process.env.NODE_ENV = "test";

export default defineConfig({
  test: { environment: "jsdom", include: ["tests/unit/**/*.test.{ts,tsx}"], setupFiles: ["tests/unit/setup.ts"], restoreMocks: true },
});
