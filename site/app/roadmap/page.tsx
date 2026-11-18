import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = { title: "Roadmap", description: "What Naksha has done so far and what it does next, phase by phase, with the check that says when each step of the plan is finished.", alternates: { canonical: "/roadmap/" } };
export default function Page() {
  return <DocPage title="Roadmap" files={["docs/ROADMAP.md"]} />;
}
