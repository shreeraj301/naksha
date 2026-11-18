import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = { title: "Brand book", description: "How Naksha looks, sounds and moves: its point of view, voice, colour, type, space, motion, icons and AI patterns, and the accessibility rules under all of it.", alternates: { canonical: "/brand/" } };
export default function Page() {
  return <DocPage title="Brand book" files={["skills/naksha/references/brand-book.md"]} />;
}
