import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = { title: "Foundations", description: "Colour, type, space and motion: the tokens behind every component." };
export default function Page() {
  return <DocPage title="Foundations" files={["skills/naksha/SKILL.md", "skills/naksha/references/tokens.md"]} only={["Colour (semantic tokens)", "Type", "Space, size, motion"]} intro="<p>Every value in Naksha is a token. These are the ones a product uses directly; the full table of all 192, with both themes, is in the repo.</p>" />;
}
