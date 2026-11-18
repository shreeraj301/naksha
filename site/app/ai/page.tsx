import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = { title: "AI", description: "Use Naksha with Claude and other agents: the skill, the AGENTS.md block and llms.txt." };
export default function Page() {
  return <DocPage title="AI" files={["README.md", "skills/naksha/SKILL.md"]} only={["Use it with AI agents", "Rules", "Reviewing UI built with Naksha"]} intro="<p>Naksha is written to be read twice: once by you, once by the agent you build with. The rules below are the same ones the Agent Skill and the AGENTS.md block carry.</p>" />;
}
