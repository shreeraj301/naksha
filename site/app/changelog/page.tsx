import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = { title: "Changelog", description: "Every Naksha release." };
export default function Page() {
  return <DocPage title="Changelog" files={["CHANGELOG.md"]} />;
}
