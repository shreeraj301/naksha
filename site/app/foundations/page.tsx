import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = { title: "Foundations", description: "The tokens behind every Naksha component: colour in light and dark, the type scale, space, size and motion, with the value each token holds.", alternates: { canonical: "/foundations/" } };
export default function Page() {
  return <DocPage title="Foundations" files={["skills/naksha/SKILL.md", "skills/naksha/references/tokens.md"]} only={["Colour (semantic tokens)", "Type", "Space, size, motion"]} intro="<p>Every value in Naksha is a token. These are the ones a product uses directly; the full table of all 195, with both themes, is in the repo.</p>" />;
}
