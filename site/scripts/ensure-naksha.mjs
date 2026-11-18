/* The site imports Naksha from ../dist. Build it when it is missing, and always on Vercel, so the site never ships a stale copy. */
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const need = ["dist/js/naksha.js", "dist/css/naksha.css", "dist/css/components.css"].some((f) => !existsSync(path.join(repo, f)));
if (need || process.env.VERCEL) {
  const run = (cmd) => execSync(cmd, { cwd: repo, stdio: "inherit", env: { ...process.env, NODE_ENV: "development" } });
  if (!existsSync(path.join(repo, "node_modules/esbuild"))) run("npm ci --include=dev --no-audit --no-fund");
  run("npm run build");
} else {
  console.log("naksha: using the existing build in ../dist");
}
