import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = { title: "Roadmap", description: "What Naksha has done and what comes next." };
export default function Page() {
  return <DocPage title="Roadmap" files={["docs/ROADMAP.md"]} />;
}
