#!/usr/bin/env node
// naksha init-agents [dir] [--agent claude|all] [--remove]
// Writes or refreshes the Naksha block (between NAKSHA:START and NAKSHA:END) in a product's AGENTS.md,
// and in CLAUDE.md when that file exists or --agent claude/all is given. Text outside the markers is never touched.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { generate } from "./skill.mjs";

const [cmd, ...rest] = process.argv.slice(2);
if (cmd !== "init-agents") {
  console.log("Usage: naksha init-agents [dir] [--agent claude|all] [--remove]");
  process.exit(cmd ? 1 : 0);
}
const dir = resolve(rest.find((a) => !a.startsWith("--")) ?? ".");
const agent = rest.includes("--agent") ? rest[rest.indexOf("--agent") + 1] : "";
const remove = rest.includes("--remove");
const block = generate().block;
const RE = /<!-- NAKSHA:START[\s\S]*?<!-- NAKSHA:END -->\n?/;

const targets = ["AGENTS.md"];
if (existsSync(join(dir, "CLAUDE.md")) || agent === "claude" || agent === "all") targets.push("CLAUDE.md");

for (const name of targets) {
  const file = join(dir, name);
  const before = existsSync(file) ? readFileSync(file, "utf8") : "";
  let after;
  if (remove) after = before.replace(RE, "");
  else if (RE.test(before)) after = before.replace(RE, block);
  else after = before ? `${before.replace(/\n*$/, "\n\n")}${block}` : block;
  if (after !== before) {
    writeFileSync(file, after);
    console.log(`${remove ? "removed from" : RE.test(before) ? "refreshed" : "added to"} ${name}`);
  } else console.log(`${name} unchanged`);
}
