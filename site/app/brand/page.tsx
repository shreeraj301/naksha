import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = { title: "Brand book", description: "How Naksha looks, sounds and moves." };
export default function Page() {
  return <DocPage title="Brand book" files={["skills/naksha/references/brand-book.md"]} />;
}
