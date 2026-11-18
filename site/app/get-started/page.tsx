import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = { title: "Get started", description: "Install Naksha, use it in a product, and build it." };
export default function Page() {
  return <DocPage title="Get started" files={["README.md"]} only={["What is in it today", "Use it", "Use it with AI agents", "One source, four outputs", "Work on it", "Decisions", "Licence"]} />;
}
