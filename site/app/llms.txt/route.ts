import { components, VERSION, GITHUB } from "@/lib/content";

export const dynamic = "force-static";
/* llms.txt: what Naksha is and where everything lives, for an agent. Component READMEs link to GitHub's raw files so an agent gets plain Markdown. */
export function GET() {
  const raw = (p: string) => `${GITHUB.replace("github.com", "raw.githubusercontent.com")}/main/${p}`;
  const lines = [
    "# Naksha",
    "",
    `> Naksha ${VERSION} is Shreeraj Narwade's design system: design tokens, ${components().length} React components on React Aria, and rules for using them. Paper and ink, square corners, seven section colours.`,
    "",
    "Use a Naksha component for anything it covers, take every value from a token, and keep overrides to layout. The Agent Skill and the AGENTS.md block carry the full rules.",
    "",
    "## Start here",
    `- [Agent Skill](${raw("skills/naksha/SKILL.md")}): rules, tokens and every component in one file`,
    `- [AGENTS.md block](${GITHUB}#use-it-with-ai-agents): add it with \`npx github:shreeraj301/naksha init-agents . --agent claude\``,
    `- [README](${raw("README.md")}): install and build`,
    "",
    "## Components",
    ...components().map((c) => `- [${c.name}](${raw(`artifact/components/${c.name}/README.md`)}): ${c.summary}`),
    "",
    "## Optional",
    `- [Tokens](${raw("skills/naksha/references/tokens.md")}): all tokens in both themes`,
    `- [Brand book](${raw("skills/naksha/references/brand-book.md")})`,
    `- [Changelog](${raw("CHANGELOG.md")})`,
    `- [Roadmap](${raw("docs/ROADMAP.md")})`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
