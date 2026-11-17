import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { generate } from "../scripts/skill.mjs";

const { files, block } = generate();
const skill = files["SKILL.md"];

test("the skill has valid Agent Skill frontmatter", () => {
  const fm = /^---\nname: (.+)\ndescription: (.+)\n---\n/.exec(skill);
  assert.ok(fm, "frontmatter");
  assert.equal(fm[1], "naksha");
  assert.ok(fm[2].length > 40 && fm[2].length < 1024);
});

test("an agent reading only the skill can answer: dark page background", () => {
  const row = skill.split("\n").find((l) => l.startsWith("| `bg-canvas` |"));
  assert.ok(row, "bg-canvas row");
  assert.match(row, /\| #151413 \(stone-950\) \|/, "dark value and primitive");
});

test("an agent reading only the skill can answer: PromptInput and IME composition", () => {
  assert.match(skill, /Enter never sends while an input method is composing/);
  assert.match(files["references/components/PromptInput.md"], /isComposing/);
});

test("every component has a reference page linked from the skill", () => {
  for (const p of Object.keys(files).filter((f) => f.startsWith("references/components/"))) {
    assert.ok(skill.includes(`(${p})`), `${p} is linked`);
  }
});

test("the agents block is marked and self-contained", () => {
  assert.match(block, /^<!-- NAKSHA:START/);
  assert.match(block, /<!-- NAKSHA:END -->\n$/);
  assert.ok(!block.includes("is below"), "does not point at content it does not contain");
});

test("the committed skill matches the sources", () => {
  for (const [p, c] of Object.entries(files)) assert.equal(readFileSync(new URL(`../skills/naksha/${p}`, import.meta.url), "utf8"), c, p);
});
